import { GoogleGenAI } from "@google/genai";

// Dummy key to prevent build-time crash — actual calls go through /api/chat on the server
const ai = new GoogleGenAI({ apiKey: "PLACEHOLDER_NOT_USED_AT_RUNTIME" });

export async function getElectionAdvice(query: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("API call failed:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
