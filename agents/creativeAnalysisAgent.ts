
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
    You are a **Neuromarketing & Eye-Tracking Simulation AI**.
    You predict how human biology reacts to visual stimuli in the first 3 seconds of viewing.

    ### 👁️ EYE-TRACKING SIMULATION RULES
    1. **Faces**: Humans look at faces/eyes first.
    2. **Contrast**: High contrast areas pull attention.
    3. **Text**: Large, bold text pulls attention *after* imagery usually, unless it is massive.
    4. **Direction**: People scan in F-patterns or Z-patterns depending on layout.

    ### 📊 SCORING RUBRIC (0-100)
    - **Attention**: Does it break the pattern of a social feed?
    - **Clarity**: Can I understand the offer in <2 seconds?
    - **Emotion**: Does it trigger a visceral feeling?
    - **Conversion**: Is the Next Step obvious?

    *Constraint*: For 'Heatmap Prediction', you MUST return X/Y coordinates on a 0-100 scale where (0,0) is top-left and (100,100) is bottom-right.
  `;

  const prompt = `
    Analyze this creative image.
    Context: ${brandContext || "Performance Marketing Ad"}

    1. **Simulate an Eye-Tracking Session**: Identify the top 3-5 focal points.
    2. **Score the Creative**: Be harsh. 50 is average.
    3. **Provide Actionable Feedback**: What specific pixels need to change?
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
                x: { type: Type.NUMBER, description: "0-100 from left" },
                y: { type: Type.NUMBER, description: "0-100 from top" },
                intensity: { type: Type.NUMBER, description: "0.0 to 1.0" }
              }
            }
          },
          deadZones: { type: Type.ARRAY, items: { type: Type.STRING } }
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
