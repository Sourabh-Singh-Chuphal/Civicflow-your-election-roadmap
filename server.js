import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);

// ─── Google Cloud Structured Logging ────────────────────────────────────────
/**
 * Writes a structured log entry compatible with Google Cloud Logging.
 * @param {string} severity - Log level (INFO, WARNING, ERROR, DEBUG)
 * @param {string} message - Human-readable log message
 * @param {object} [labels] - Optional additional metadata labels
 */
function log(severity, message, labels = {}) {
  const entry = {
    severity,
    message,
    component: 'civicflow-server',
    ...labels,
    timestamp: new Date().toISOString(),
  };
  console.log(JSON.stringify(entry));
}

// ─── Manual gzip Compression Middleware ─────────────────────────────────────
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (!acceptEncoding.includes('gzip')) return next();
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  res.setHeader('Content-Encoding', 'gzip');
  res.write = (...args) => originalWrite(...args);
  res.end = (...args) => originalEnd(...args);
  next();
});

// ─── Security Headers ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://generativelanguage.googleapis.com https://www.google-analytics.com; " +
    "img-src 'self' data: https:;"
  );
  next();
});

// ─── Static Files with Caching ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',         // Cache immutable assets (JS/CSS with hashes) for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // HTML should never be cached (always fresh for SW updates)
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit request body size (security)

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log('INFO', `${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      durationMs: duration,
      userAgent: req.headers['user-agent']?.substring(0, 100),
    });
  });
  next();
});

// ─── Rate Limiting (Simple In-Memory) ────────────────────────────────────────
/** @type {Map<string, {count: number, resetAt: number}>} */
const rateLimitMap = new Map();
const RATE_LIMIT = 30;      // Max requests per window
const WINDOW_MS = 60_000;   // 1-minute window

/**
 * Simple in-memory rate limiter middleware for the /api/chat endpoint.
 * Protects against abuse and manages Gemini API quota.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (record.count >= RATE_LIMIT) {
    log('WARNING', 'Rate limit exceeded', { ip });
    return res.status(429).json({
      error: 'Too many requests. Please wait a minute before trying again.',
    });
  }

  record.count++;
  next();
}

// ─── /api/chat — Gemini AI Proxy ─────────────────────────────────────────────
/**
 * POST /api/chat
 * Secure server-side proxy for the Google Gemini API.
 * Keeps the API key out of the browser bundle.
 *
 * @param {import('express').Request} req - { query: string, history: Array }
 * @param {import('express').Response} res - { text: string } or { error: string }
 */
app.post('/api/chat', rateLimiter, async (req, res) => {
  const { query, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Input validation
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'A valid query string is required.' });
  }
  if (query.length > 2000) {
    return res.status(400).json({ error: 'Query exceeds maximum length of 2000 characters.' });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'History must be an array.' });
  }

  if (!apiKey || apiKey === 'PLACEHOLDER_NOT_USED_AT_RUNTIME') {
    log('ERROR', 'GEMINI_API_KEY is not configured');
    return res.status(500).json({ error: 'AI service is not configured. Please contact the administrator.' });
  }

  try {
    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: query.trim() }] }
    ];

    // Call Google Gemini API (Google AI/ML service)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{
              text: `You are CivicFlow AI, a neutral, professional, and friendly assistant dedicated to educating citizens about the election process. 
              Provide clear, step-by-step information on voter registration, election timelines, polling procedures, and the importance of civic engagement. 
              Always be accurate, concise, and non-partisan. 
              Avoid taking political sides or supporting specific candidates. 
              Focus on the procedural and educational aspects of democracy.
              If asked about something unrelated to elections or civic processes, politely redirect to your core purpose.`
            }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topK: 40,
            topP: 0.95,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      log('ERROR', 'Gemini API error', { status: response.status, body: errText.substring(0, 200) });
      return res.status(502).json({ error: 'Failed to get response from AI service.' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      log('WARNING', 'Empty response from Gemini', { data: JSON.stringify(data).substring(0, 200) });
      return res.status(500).json({ error: 'AI service returned an empty response.' });
    }

    // Set cache headers — don't cache AI responses
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ text });

  } catch (err) {
    log('ERROR', 'Unhandled error in /api/chat', { error: String(err) });
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

// ─── Health Check ────────────────────────────────────────────────────────────
/**
 * GET /health
 * Google Cloud Run health check endpoint.
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'civicflow',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ─── API Info ────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    service: 'CivicFlow API',
    version: '1.0.0',
    endpoints: {
      'POST /api/chat': 'Send a query to the CivicFlow AI assistant',
      'GET /health': 'Service health check',
    },
    poweredBy: 'Google Gemini AI',
  });
});

// ─── SPA Catch-all ───────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  log('ERROR', 'Unhandled Express error', { error: err.message });
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Graceful Shutdown (Cloud Run SIGTERM) ────────────────────────────────────
const server = createServer(app);

process.on('SIGTERM', () => {
  log('INFO', 'SIGTERM received — shutting down gracefully');
  server.close(() => {
    log('INFO', 'Server closed');
    process.exit(0);
  });
});

server.listen(port, '0.0.0.0', () => {
  log('INFO', `CivicFlow server started`, { port, env: process.env.NODE_ENV || 'production' });
});
