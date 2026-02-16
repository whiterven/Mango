import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";

export interface PerformanceMetrics {
  attention: number;
  clarity: number;
  conversion: number;
  overall: number;
  reasoning: string;
}

export const performanceAgent = async (
  input: string,
  type: 'concept' | 'image'
): Promise<PerformanceMetrics> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a Conversion Rate Optimization (CRO) Specialist AI.
    Your task is to predict the performance of ad creatives on social media (Facebook/Instagram/TikTok).
    
    **SCORING CRITERIA (0-100):**
    
    1. **Attention Score (Stop Ratio)**:
       - Does the visual have high contrast?
       - Is there a "pattern interrupt" (something unexpected)?
       - Are there faces or strong focal points?
       
    2. **Clarity Score (Hold Rate)**:
       - Is the value proposition immediately obvious (<2 seconds)?
       - Is the text legible and concise?
       
    3. **Conversion Score (Click Rate)**:
       - Is there a clear Call to Action (CTA)?
       - Does it trigger a psychological desire (FOMO, Greed, Relief)?
    
    **CALIBRATION:**
    - 50 is Average.
    - 80+ is Top 1% Viral.
    - Be strict. Do not give high scores easily.
  `;

  let contents;
  
  if (type === 'image') {
     // For image analysis, we pass the text prompt and the image data
     contents = {
        parts: [
            { text: "Analyze this ad creative image. Predict its performance metrics based on visual psychology." },
            { inlineData: { mimeType: "image/png", data: input.replace(/^data:image\/\w+;base64,/, '') } }
        ]
     };
  } else {
     // For text/concept analysis
     contents = {
        parts: [{ text: `Analyze this ad concept text/script for performance potential:\n\n${input}` }]
     };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      attention: { type: Type.NUMBER, description: "0-100 score for scroll stopping power." },
      clarity: { type: Type.NUMBER, description: "0-100 score for message intelligibility." },
      conversion: { type: Type.NUMBER, description: "0-100 score for purchase/click intent." },
      overall: { type: Type.NUMBER, description: "Weighted average of scores." },
      reasoning: { type: Type.STRING, description: "Tactical explanation of the score with improvement tips." }
    },
    required: ["attention", "clarity", "conversion", "overall", "reasoning"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Performance Agent failed to generate prediction");
  return JSON.parse(response.text) as PerformanceMetrics;
};