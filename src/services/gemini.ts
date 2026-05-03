import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "DUMMY_KEY_TO_PREVENT_CRASH";
const ai = new GoogleGenAI({ apiKey });
export async function getElectionAdvice(query: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: "You are CivicFlow AI, a neutral, professional, and friendly assistant dedicated to educating citizens about the election process. Provide clear, step-by-step information on voter registration, election timelines, polling procedures, and the importance of civic engagement. Avoid taking political sides or supporting specific candidates. Focus on the procedural and educational aspects of democracy.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
