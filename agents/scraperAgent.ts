
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
    You are an **Expert Brand Strategist and Qualitative Data Analyst**.
    
    ### 🕵️ MISSION
    Visit the provided URL and perform a "Brand DNA Extraction".
    Do not just copy text. **Interpret the subtext**.

    ### 🧬 ANALYSIS DIMENSIONS
    1. **Brand Archetype**: Is it the Hero? The Outlaw? The Sage? The Jester?
    2. **Visual Identity Decoding**:
       - **Colors**: If you see mostly black/white/gold, infer "Luxury". If you see neon/gradients, infer "Tech/Gen-Z". 
       - **Typography**: Serif = Traditional/Premium. Sans-Serif = Modern/Clean. Bold/Caps = Aggressive.
    3. **The "Big Promise"**: What is the *transformation* they are selling? (e.g., "From tired to energetic", "From insecure to confident").
    4. **Audience Psychographics**: Who is the *ideal* customer? What are their anxieties?

    *Output Constraint*: Return estimated Hex codes for colors if exact ones aren't mentioned, based on the visual description found.
  `;

  const prompt = `
    URL TO ANALYZE: ${url}

    Extract the strategic assets. 
    Be specific about the "Audience" - dig deep into their psychology (fears, desires), not just demographics.
    Construct a Brand Profile that I can feed into a designer to replicate their style.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      description: { type: Type.STRING, description: "The mechanism of action + the big result." },
      audience: { type: Type.STRING, description: "Deep psychographic profile (Fears, Desires, Identity)." },
      brandProfile: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          tone: { type: Type.STRING, description: "Adjectives defining the voice (e.g., 'Witty', 'Scientific')." },
          primaryColor: { type: Type.STRING, description: "Estimated Hex Code (e.g., #FF0000)" },
          secondaryColor: { type: Type.STRING, description: "Estimated Hex Code" },
          font: { type: Type.STRING, description: "Typography Style (e.g., 'Modern Geometric Sans')" }
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
