import { getAiClient } from "../services/aiService";
import { AspectRatio, ImageSize } from "../types";

export const imageAgent = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize = '1K'
): Promise<string> => {
  const ai = getAiClient();

  // Mapping generic aspect ratios to Gemini-supported ones.
  // Note: 4:5 is not natively supported by all model versions, 
  // mapping to 3:4 (standard vertical) or 1:1 based on best fit. 
  // 3:4 preserves verticality better than 1:1.
  let targetRatio: string = aspectRatio;
  if (aspectRatio === '4:5') {
      targetRatio = '3:4'; 
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: targetRatio,
        imageSize: imageSize
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Image generation failed to return data");
};