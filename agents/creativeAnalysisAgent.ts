
import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";

export interface CreativeAnalysisResult {
  scores: {
    attention: number;
    clarity: number;
    emotionalImpact: number;
    conversionProbability: number;
    brandAlignment: number;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  heatmapPrediction: {
    focalPoints: { label: string, x: number, y: number, intensity: number }[];
    deadZones: string[];
  };
}

export const creativeAnalysisAgent = async (
  imageBase64: string,
  brandContext?: string
): Promise<CreativeAnalysisResult> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a Senior Creative Strategist and conversion optimization expert.
    Analyze ad creatives with extreme scrutiny. 
    Predict user eye-tracking behavior (heatmap) and conversion potential.
  `;

  const prompt = `
    Analyze this ad creative.
    Brand Context: ${brandContext || "General E-commerce Brand"}

    1. Score it on 5 key metrics (0-100).
    2. Provide brutal, actionable feedback.
    3. Predict where a user's eye will focus first (Focal Points) and provide estimated X/Y coordinates (0-100 scale) for where these points are located on the image.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          attention: { type: Type.NUMBER },
          clarity: { type: Type.NUMBER },
          emotionalImpact: { type: Type.NUMBER },
          conversionProbability: { type: Type.NUMBER },
          brandAlignment: { type: Type.NUMBER }
        },
        required: ["attention", "clarity", "emotionalImpact", "conversionProbability", "brandAlignment"]
      },
      feedback: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strengths", "weaknesses", "improvements"]
      },
      heatmapPrediction: {
        type: Type.OBJECT,
        properties: {
          focalPoints: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                x: { type: Type.NUMBER, description: "X percentage (0-100) from left" },
                y: { type: Type.NUMBER, description: "Y percentage (0-100) from top" },
                intensity: { type: Type.NUMBER, description: "Heat intensity 0-1" }
              }
            }
          },
          deadZones: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Areas that will likely be ignored." }
        },
        required: ["focalPoints", "deadZones"]
      }
    },
    required: ["scores", "feedback", "heatmapPrediction"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Creative Analysis Failed");
  return JSON.parse(response.text) as CreativeAnalysisResult;
};
