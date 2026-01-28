import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export function getChatModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: "gemini-3-pro-preview",
    systemInstruction: systemInstruction,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
    },
  });
}

export const jsonModel = genAI.getGenerativeModel({
  model: "gemini-3-pro-preview",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.2,
  },
});
