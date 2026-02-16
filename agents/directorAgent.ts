import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { DirectorOutput, PlannerOutput, CreativeControls } from "../types";

export const directorAgent = async (
  plannerOutput: PlannerOutput,
  platform: string,
  variationCount: number = 1,
  feedback?: string,
  creativeControls?: CreativeControls
): Promise<DirectorOutput> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a Technical Art Director and Prompt Engineering Specialist.
    Your output is fed directly into a high-end AI image generator (Nano Banana Pro / Imagen 3).
    
    **YOUR MANDATE:**
    Translate abstract marketing concepts into **Technical Photography Directives**.
    
    **PHOTOGRAPHIC RULES (MUST USE):**
    1. **Camera & Lens**: Specify the gear to define the look.
       - *Portrait/Product*: "85mm f/1.8", "100mm Macro".
       - *Lifestyle/Action*: "35mm f/2.8", "Wide Angle 24mm".
    2. **Lighting Rigs**: 
       - "Rembrandt Lighting" (Moody/Drama).
       - "Softbox Diffused" (Beauty/Clean).
       - "Neon Rim Light" (Tech/Edgy).
       - "Golden Hour Backlit" (Warmth/Lifestyle).
    3. **Film Stock/Texture**: 
       - "Kodak Portra 400" (Natural grain).
       - "Fujifilm Velvia" (High saturation).
       - "Digital Sharp 8K" (Clean commercial).
    
    **PLATFORM OPTIMIZATION**:
    - **${platform}**: Ensure the focal point is in the center 60% of the frame (safe zone). 
    - High contrast is required to stand out on mobile screens.

    **VARIATION STRATEGY**:
    - If ${variationCount} variations are requested, change the *Camera Angle* and *Lighting* for each.
  `;

  let prompt = `
    SOURCE CONCEPT:
    - Visual: ${plannerOutput.visualConcept}
    - Composition: ${plannerOutput.composition}
    - Mood: ${plannerOutput.colorDirection}
    - Emotion: ${plannerOutput.emotion}
  `;

  // Apply Creative Controls
  if (creativeControls) {
    prompt += `
    \n🎛 **CREATIVE CONTROL SETTINGS (APPLY STRICTLY)**:
    - Minimalism Level: ${creativeControls.minimalism}/100 (If >80: Negative space, clean lines. If <30: Complex, busy, detailed).
    - Color Vibrancy: ${creativeControls.vibrancy}/100 (If >80: Neon, highly saturated, pop. If <30: Desaturated, pastel, matte).
    - Lighting Drama: ${creativeControls.lightingDrama}/100 (If >80: High contrast, hard shadows. If <30: Flat, soft, diffuse).
    - Vibe Mood: ${creativeControls.mood.toUpperCase()} (Adjust props and setting to match this).
    `;
  }

  if (feedback) {
    prompt += `
    \n🚨 **REGENERATION INSTRUCTION (CRITICAL)**:
    The client wants to adjust the previous result.
    **FEEDBACK:** "${feedback}"
    Apply this feedback aggressively to the new prompts.
    `;
  }

  prompt += `
    \nTASKS:
    1. Refine the concept into a specific visual direction based on controls.
    2. Write the "Champion Prompt" (Technical Prompt).
    3. Generate ${variationCount} distinct prompt variations.
    4. Predict performance score with reasoning.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      improvedConcept: { type: Type.STRING, description: "Rationale for the visual direction." },
      technicalPrompt: { type: Type.STRING, description: "The master prompt with all technical keywords." },
      generationPrompts: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: `Exactly ${variationCount} prompts.`
      },
      creativeStrength: {
        type: Type.OBJECT,
        properties: {
          attention: { type: Type.NUMBER },
          clarity: { type: Type.NUMBER },
          conversion: { type: Type.NUMBER },
          overall: { type: Type.NUMBER },
          reasoning: { type: Type.STRING, description: "Why this score? Explain the visual psychology." }
        },
        required: ["overall", "attention", "clarity", "conversion", "reasoning"]
      },
      variations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            angle: { type: Type.STRING },
            promptAdjustment: { type: Type.STRING }
          }
        }
      }
    },
    required: ["improvedConcept", "technicalPrompt", "generationPrompts", "creativeStrength", "variations"]
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

  if (!response.text) throw new Error("Director Agent returned empty response");
  return JSON.parse(response.text) as DirectorOutput;
};