
import { GoogleGenAI } from "@google/genai";

export async function tonegeneratedmsg(message, tone) {
    
    if (!process.env.GEMINI_API_KEY) { // <-- Checking the environment directly
        throw new Error("GEMINI_API_KEY is not defined. Check your .env file and index.js setup.");
    }
const apiKey = process.env.GEMINI_API_KEY;
    
    // The client initialization:
    const genai = new GoogleGenAI({ apiKey }); 
    try {
        const prompt = `You are a professional message tone changer. Rewrite the user's message to adopt a ${tone} tone. Only return the rewritten message. Do NOT explain anything.`;
        Message:`${message}`;

        const response = await genai.models.generateContent({
            model: "gemini-2.5-flash-lite", 
            contents: message,
            config: {
                systemInstruction: prompt,
                temperature: 0.8, 
            },
        });

        const newgeneratedmsg = response.text.trim();
        return newgeneratedmsg

    } catch (error) {
        console.error("Gemini API Error:", error);
    }
}
