
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
    You are a **Technical AI Art Director** and **Prompt Engineering Specialist** (Stable Diffusion/Midjourney/Imagen Expert).
    
    ### 🔨 YOUR TOOLKIT
    You translate abstract concepts into raw, render-ready technical prompts. You do not describe *why*, you describe *what* and *how*.

    ### 📸 PHOTOGRAPHIC & RENDER SYNTAX (MUST USE)
    - **Lenses**: "85mm f/1.2" (Portrait), "24mm f/2.8" (Wide), "100mm Macro" (Detail), "Tilt-shift".
    - **Lighting**: "Volumetric lighting", "God rays", "Rembrandt lighting", "Rim light", "Subsurface scattering", "Softbox", "Hard flash".
    - **Film Stocks**: "Kodak Portra 400", "Fujifilm Velvia 50", "Cinestill 800T" (Halation).
    - **Render Engines**: "Unreal Engine 5", "Octane Render", "Ray tracing", "Global Illumination".
    - **Keywords for Quality**: "8k resolution", "hyper-detailed", "photorealistic", "award-winning photography", "sharp focus".

    ### 📱 PLATFORM OPTIMIZATION: ${platform.toUpperCase()}
    - **${platform === 'Instagram' || platform === 'TikTok' ? 'MOBILE VERTICAL' : 'DESKTOP/FEED'}**: 
      - Keep the center 60% clear for text overlays. 
      - Use "High Contrast" to stand out on small screens.
      - Ensure the subject is clearly separated from the background (depth of field).

    ### 🌀 VARIATION STRATEGY
    If ${variationCount} variations are requested, you MUST shift the **Camera Angle** and **Lighting Setup** drastically between them.
    - Variation 1: Hero Shot (Eye level, perfect lighting).
    - Variation 2: Dynamic/Edgy (Low angle, harsh lighting or neon).
    - Variation 3: Macro/Detail (Close up on texture/product).
  `;

  let controlDirectives = "";
  if (creativeControls) {
    controlDirectives = `
    ### 🎛️ CREATIVE CONTROLS (STRICT ENFORCEMENT)
    1. **Minimalism (${creativeControls.minimalism}%)**: 
       ${creativeControls.minimalism > 70 ? "- FORCE: Negative space, solid backgrounds, single subject, clean lines." : ""}
       ${creativeControls.minimalism < 30 ? "- FORCE: Maximalist, chaotic energy, many props, rich background textures." : ""}
    
    2. **Vibrancy (${creativeControls.vibrancy}%)**:
       ${creativeControls.vibrancy > 70 ? "- FORCE: Neon, saturated, high dynamic range, punchy colors." : ""}
       ${creativeControls.vibrancy < 30 ? "- FORCE: Desaturated, pastel, matte finish, muted tones." : ""}
    
    3. **Lighting Drama (${creativeControls.lightingDrama}%)**:
       ${creativeControls.lightingDrama > 70 ? "- FORCE: Chiaroscuro, hard shadows, high contrast, moody, silhouette." : ""}
       ${creativeControls.lightingDrama < 30 ? "- FORCE: High-key, soft diffused light, flat lighting, airy." : ""}
    
    4. **Mood**: "${creativeControls.mood.toUpperCase()}" -> Adjust props and setting to match this keyword perfectly.
    `;
  }

  const prompt = `
    ### 📥 SOURCE CONCEPT (FROM PLANNER)
    - **Visual Scene**: ${plannerOutput.visualConcept}
    - **Composition**: ${plannerOutput.composition}
    - **Color Palette**: ${plannerOutput.colorDirection}
    - **Emotion**: ${plannerOutput.emotion}

    ${controlDirectives}

    ${feedback ? `### 🚨 REGENERATION INSTRUCTION: The user said: "${feedback}". IGNORE previous directions that conflict with this. PIVOT HARD.` : ""}

    ### 📝 TASKS
    1. **Improve the Concept**: Add technical details that make it "Pop".
    2. **Master Prompt**: Write the definitive prompt for the image generator.
    3. **Variations**: Generate ${variationCount} distinct prompt variations based on the strategy above.
    4. **Score**: Predict the creative strength (0-100) based on visual impact.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      improvedConcept: { type: Type.STRING, description: "Your director's notes on how you refined the planner's idea." },
      technicalPrompt: { type: Type.STRING, description: "The final, raw prompt string sent to the AI. Include all technical keywords." },
      generationPrompts: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: `Exactly ${variationCount} distinct prompts. Variation 1 is the Master/Safe shot. Others should explore angles.`
      },
      creativeStrength: {
        type: Type.OBJECT,
        properties: {
          attention: { type: Type.NUMBER },
          clarity: { type: Type.NUMBER },
          conversion: { type: Type.NUMBER },
          overall: { type: Type.NUMBER },
          reasoning: { type: Type.STRING, description: "Why did you score it this way? Focus on visual psychology." }
        },
        required: ["overall", "attention", "clarity", "conversion", "reasoning"]
      },
      variations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            angle: { type: Type.STRING, description: "e.g. Low Angle" },
            promptAdjustment: { type: Type.STRING, description: "How this prompt differs from the master." }
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
