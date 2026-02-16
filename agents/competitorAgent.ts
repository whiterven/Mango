import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { CompetitorAnalysis } from "../types";

/**
 * Analyzes a competitor via Image (Base64) or Website URL.
 */
export const competitorAgent = async (
  input: string, 
  inputType: 'image' | 'url'
): Promise<CompetitorAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a Competitive Intelligence Strategist.
    Your goal is to deconstruct competitor marketing to find "Gaps" we can exploit.
    
    **ANALYSIS FRAMEWORK:**
    1. **Visual/Brand Audit**: What is their aesthetic? (e.g., Corporate, UGC, Meme-style, Luxury).
    2. **Hook Detection**: What is the core promise or "Big Idea" they are selling?
    3. **Weakness Identification**: 
       - Are they boring? 
       - Is the copy too long? 
       - Is the value prop unclear? 
       - Do they lack social proof?
    4. **The Pivot (Opportunity)**: How do we position AGAINST them? (e.g., "They are complex -> We are simple", "They are cheap -> We are premium").
  `;

  let prompt = "";
  let contents: any = {};
  let tools: any[] = [];

  if (inputType === 'url') {
    prompt = `
      Analyze this competitor's landing page or ad url: ${input}
      
      Use Google Search to understand their brand positioning if the URL is generic.
      Extract their core hook, visual style, and find 3 critical weaknesses in their messaging or presentation.
      Define a "Winning Angle" to beat them.
    `;
    contents = { role: "user", parts: [{ text: prompt }] };
    tools = [{ googleSearch: {} }];
  } else {
    prompt = `
      Analyze this competitor ad image.
      Deconstruct the visual hierarchy, the text overlay hook, and the overall vibe.
      Identify 3 specific execution weaknesses.
      Define a "Winning Angle" to beat this creative.
    `;
    contents = {
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: input } }
      ]
    };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      visualStyle: { type: Type.STRING, description: "Description of the competitor's aesthetic and tone." },
      detectedHook: { type: Type.STRING, description: "The core selling proposition or hook identified." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 strategic or creative flaws." },
      opportunityAngle: { type: Type.STRING, description: "The differentiation strategy to outperform them." }
    },
    required: ["visualStyle", "detectedHook", "weaknesses", "opportunityAngle"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for deeper reasoning
    contents: contents,
    config: {
      systemInstruction,
      tools: tools.length > 0 ? tools : undefined,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Competitor Agent returned empty response");
  return JSON.parse(response.text) as CompetitorAnalysis;
};