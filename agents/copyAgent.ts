import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { AdCopy, PlannerOutput } from "../types";

export const copyAgent = async (
  productName: string,
  plannerOutput: PlannerOutput,
  platform: string,
  audience: string
): Promise<AdCopy> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a World-Class Direct Response Copywriter (Ogilvy, Schwartz, Hopkins level).
    Your goal is to write ad copy that stops the scroll and forces the click.
    
    **PLATFORM RULES:**
    - **Facebook/Instagram**:
      - Primary Text: Use the "Hook-Story-Offer" framework. Use line breaks. Use emojis tastefully.
      - Headline: Short, punchy, benefit-driven (max 40 chars).
      - Tone: Conversational, authentic, slightly polarizing (if fits the angle).
    
    - **LinkedIn**:
      - Professional but personal. Focus on ROI, efficiency, and status.
      - No "bro-marketing" fluff.
    
    **STRATEGY:**
    - **Hook**: Use the planner's hook but make it readable.
    - **Body**: Agitate the pain point, present the solution (product), provide social proof.
    - **CTA**: Clear, imperative directive.
  `;

  const prompt = `
    **CAMPAIGN CONTEXT:**
    - Product: ${productName}
    - Target Audience: ${audience}
    - Selected Platform: ${platform}
    - Strategic Hook: "${plannerOutput.hook}"
    - Psychological Angle: ${plannerOutput.angle}
    - Emotional Goal: ${plannerOutput.emotion}
    
    **TASK:**
    Write a high-converting ad copy set for this specific campaign.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      headline: { type: Type.STRING, description: "The bold headline that appears near the CTA button." },
      primaryText: { type: Type.STRING, description: "The main body text (caption) of the ad." },
      cta: { type: Type.STRING, description: "The button text (e.g., Shop Now, Learn More)." }
    },
    required: ["headline", "primaryText", "cta"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Copy Agent failed to generate text");
  return JSON.parse(response.text) as AdCopy;
};