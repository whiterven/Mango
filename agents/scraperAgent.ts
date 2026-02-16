import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { BrandProfile } from "../types";

export interface ScraperOutput {
  productName: string;
  description: string;
  audience: string;
  brandProfile: Partial<BrandProfile>;
}

export const scraperAgent = async (url: string): Promise<ScraperOutput> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are an expert Brand Auditor and Marketing Intelligence Analyst. 
    Your mission is to deconstruct a landing page to understand the "Soul" of the brand.
    
    Do not just extract text. Analyze the subtext.
    
    1. **Product DNA**: Identify not just what the product is, but the "Mechanism of Action" (how it works) and the "Big Promise" (the result).
    2. **Audience Profiling**: Infer the psychographics. What keeps this customer up at night? What status signal are they looking for?
    3. **Visual Identity**:
       - Estimate specific Hex Codes for primary/secondary colors based on dominant visual elements.
       - Classify the Typography (e.g., "Clean Minimalist Sans-Serif", "Luxury Serif", "Bold Brutalist").
       - Define the Mood/Tone (e.g., "Clinical & Trustworthy", "High-Energy Hype", "Earthy & Organic").
    
    Your output must be precise, professional, and ready for a creative strategy team.
  `;

  const prompt = `
    Perform a deep-dive audit of this URL: ${url}

    Extract the following strategic assets:
    - Product Name & Core Value Proposition.
    - Deep Audience Psychographics (Who is this REALLY for?).
    - A constructed Brand Identity Profile (Colors, Fonts, Tone).
    
    Return the data in the specified JSON format.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      description: { type: Type.STRING, description: "The core value prop and mechanism of action." },
      audience: { type: Type.STRING, description: "Detailed psychographic profile of the target buyer." },
      brandProfile: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tone: { type: Type.STRING, description: "Adjectives describing the brand voice (e.g., Witty, Scientific, Luxurious)." },
          primaryColor: { type: Type.STRING, description: "Estimated Hex Code" },
          secondaryColor: { type: Type.STRING, description: "Estimated Hex Code" },
          font: { type: Type.STRING, description: "Description of typography style" }
        }
      }
    },
    required: ["productName", "description", "audience", "brandProfile"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      tools: [
        { googleSearch: {} }, 
        { urlContext: {} }
      ],
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Scraper Agent returned empty response");
  return JSON.parse(response.text) as ScraperOutput;
};
