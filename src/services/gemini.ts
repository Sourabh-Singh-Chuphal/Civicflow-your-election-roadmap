/**
 * @module gemini
 * @description Client-side service layer for the CivicFlow AI assistant.
 * All API calls are proxied through the backend /api/chat endpoint to keep
 * the GEMINI_API_KEY secure on the server side (never exposed to the browser).
 * 
 * Architecture:
 *   Browser → POST /api/chat → Express Server → Google Gemini API
 */

import type { ChatMessage, ChatResponse } from '../types';

/** Base URL for all API calls (relative for same-origin requests) */
const API_BASE = '/api';

/**
 * Sends a user query to the CivicFlow AI engine via the secure backend proxy.
 * Uses Google Gemini 2.0 Flash for fast, high-quality election education responses.
 * 
 * @param {string} query - The user's question about the election process
 * @param {ChatMessage[]} [history=[]] - Previous conversation turns for context
 * @returns {Promise<string>} The AI-generated response text
 * 
 * @example
 * const response = await getElectionAdvice('How do I register to vote?');
 * console.log(response); // "To register to vote, visit vote.gov..."
 */
export async function getElectionAdvice(
  query: string,
  history: ChatMessage[] = []
): Promise<string> {
  // Validate inputs before sending
  if (!query || query.trim().length === 0) {
    return 'Please enter a question to get started.';
  }

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        history,
      }),
    });

    if (!response.ok) {
      const errorData: ChatResponse = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${response.status}`;

      // Log client-side error for monitoring
      console.error(JSON.stringify({
        severity: 'ERROR',
        message: 'CivicFlow API request failed',
        component: 'civicflow-client',
        statusCode: response.status,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }));

      if (response.status === 429) {
        return "You've sent too many messages. Please wait a moment before trying again.";
      }
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
    }

    const data: ChatResponse = await response.json();

    if (!data.text) {
      return "I received an empty response. Please try rephrasing your question.";
    }

    return data.text;

  } catch (error) {
    // Log network/parse errors
    console.error(JSON.stringify({
      severity: 'ERROR',
      message: 'Network error calling CivicFlow API',
      component: 'civicflow-client',
      error: String(error),
      timestamp: new Date().toISOString(),
    }));

    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please check your connection and try again.";
  }
}
