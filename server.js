import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for Gemini API - key stays safe on the server
app.post('/api/chat', async (req, res) => {
  const { query, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: query }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{
              text: "You are CivicFlow AI, a neutral, professional, and friendly assistant dedicated to educating citizens about the election process. Provide clear, step-by-step information on voter registration, election timelines, polling procedures, and the importance of civic engagement. Avoid taking political sides or supporting specific candidates. Focus on the procedural and educational aspects of democracy."
            }]
          },
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(500).json({ error: 'Gemini API returned an error.' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return res.json({ text });
  } catch (err) {
    console.error('Server error calling Gemini:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`CivicFlow server running on port ${port}`);
});
