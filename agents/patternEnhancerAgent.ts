
import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { PlannerOutput, ViralPattern } from "../types";

export const patternEnhancerAgent = async (
  concept: PlannerOutput,
  pattern: ViralPattern
): Promise<PlannerOutput> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a **Viral Engineering Specialist**.
    Your goal is to take a standard ad concept and force it into a specific "Viral Framework".
    
    FRAMEWORK TO APPLY: "${pattern.name}"
    FRAMEWORK DESCRIPTION: ${pattern.description}
    EXAMPLE: ${pattern.example}

    You must rewrite the "Visual Concept" and "Hook" to match this framework exactly, while keeping the original product and emotion.
  `;

  const prompt = `
    ORIGINAL HOOK: ${concept.hook}
    ORIGINAL VISUAL: ${concept.visualConcept}
    EMOTION: ${concept.emotion}

    Refactor this into the "${pattern.name}" format. 
    If the pattern is "Us vs Them", you MUST describe a split screen.
    If the pattern is "Fake UI", you MUST describe a notification or interface element.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      hook: { type: Type.STRING, description: "The new hook adapted to the pattern." },
      angle: { type: Type.STRING, description: "The updated angle." },
      emotion: { type: Type.STRING, description: "Preserve the original emotion." },
      visualConcept: { type: Type.STRING, description: "The new visual description strictly following the viral pattern structure." },
      composition: { type: Type.STRING },
      colorDirection: { type: Type.STRING },
      textOverlayIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
      ctaIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["hook", "visualConcept", "angle", "emotion", "composition", "colorDirection"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Pattern Enhancer failed");
  return JSON.parse(response.text) as PlannerOutput;
};
