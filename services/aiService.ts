import { GoogleGenAI } from "@google/genai";

export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select an API key via the settings.");
  }
  return new GoogleGenAI({ apiKey });
};
