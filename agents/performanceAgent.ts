
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
    You are a **Senior Media Buyer & CRO Specialist** who manages $10M+ in annual ad spend.
    You predict ad performance based on historical benchmarks of high-converting creatives.

    ### 📊 SCORING ALGORITHM (0-100)
    
    1. **Attention (The "Thumb-Stop")**: 
       - 0-40: Boring, looks like an ad, generic stock photo.
       - 41-70: Good design, clear subject.
       - 71-100: "Pattern Interrupt" present. Shocking, weird, highly aesthetic, or hyper-relevant.

    2. **Clarity (The " squint test")**:
       - Can I tell what you are selling in 1.5 seconds?
       - If text is cluttered -> Low Score.
       - If product is hidden -> Low Score.

    3. **Conversion (The "Click")**:
       - Is there a clear reason to click *now*? (Urgency, curiosity, huge benefit).
       - Is the CTA visible?

    ### 📉 BENCHMARKING
    - Most ads are mediocre (Score 40-60). 
    - Do not give scores above 85 unless the creative is truly exceptional and follows direct-response best practices perfectly.
  `;

  let contents;
  
  if (type === 'image') {
     contents = {
        parts: [
            { text: "Analyze this ad creative. Predict its CTR & CVR potential. Be harsh." },
            { inlineData: { mimeType: "image/png", data: input.replace(/^data:image\/\w+;base64,/, '') } }
        ]
     };
  } else {
     contents = {
        parts: [{ text: `Analyze this ad concept/script for performance potential. Would you spend budget on this?\n\n${input}` }]
     };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      attention: { type: Type.NUMBER },
      clarity: { type: Type.NUMBER },
      conversion: { type: Type.NUMBER },
      overall: { type: Type.NUMBER },
      reasoning: { type: Type.STRING, description: "Tactical breakdown of why this score was given + 1 specific improvement." }
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
