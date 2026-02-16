import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { CompetitorAnalysis } from "../types";

export const analyzeCompetitorAd = async (imageBase64: string): Promise<CompetitorAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a Competitive Intelligence Ad Analyst.
    Your job is to deconstruct an image ad to find its strategic weaknesses and opportunities.
    
    Look for:
    1. **Visual Cliche**: Is it generic? Stock photo? 
    2. **Hook Weakness**: Is the angle boring?
    3. **Opportunity**: How can we beat this? (e.g., "Competitor is too dark/moody, we should go bright/energetic" or "Competitor is messy, we should be clean").
  `;

  const prompt = `
    Analyze this competitor ad image.
    Identify the visual style, the implied hook, and 3 specific weaknesses.
    Then, provide a "Differentiation Angle" - how can we visually beat this ad?
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      visualStyle: { type: Type.STRING, description: "Description of the competitor's look." },
      detectedHook: { type: Type.STRING, description: "What are they trying to say?" },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 weak points." },
      opportunityAngle: { type: Type.STRING, description: "Strategic direction to outperform this ad." }
    },
    required: ["visualStyle", "detectedHook", "weaknesses", "opportunityAngle"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { text: prompt },
        { 
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Competitor Analysis Agent returned empty response");
  return JSON.parse(response.text) as CompetitorAnalysis;
};