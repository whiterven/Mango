
import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { PlannerOutput, BrandProfile } from "../types";
import { patterns } from "../data/adPatterns";

export const plannerAgent = async (
  product: string,
  description: string,
  audience: string,
  brand?: BrandProfile
): Promise<PlannerOutput> => {
  const ai = getAiClient();

  const brandContext = brand 
    ? `
      ### 🛡️ STRICT BRAND DNA (NON-NEGOTIABLE)
      - **Archetype**: ${brand.tone}
      - **Visual Anchor Color**: ${brand.primaryColor} (Must be the dominant accent)
      - **Secondary Palette**: ${brand.secondaryColor}
      - **Typography Vibe**: ${brand.font}
      - **Specific Rules**: ${brand.additionalGuidelines || "Clean, high-end, commercial production value."}
      
      *Constraint*: The "Visual Concept" MUST explicitly describe how ${brand.primaryColor} is integrated into the scene (e.g., "Neon lighting in ${brand.primaryColor}", "Prop styling using ${brand.primaryColor} accents").
      ` 
    : "### ⚪ GENERIC BRANDING\nNo specific brand kit provided. Adopt a 'Modern Minimalist' aesthetic suitable for high-conversion e-commerce.";

  // Inject viral patterns into context
  const viralPatternContext = patterns.map(p => `- "${p.name}": ${p.description} (Use strictly if it fits the angle)`).join('\n');

  const systemInstruction = `
    You are a **World-Class Creative Strategist** (ex-Ogilvy/Droga5) specializing in Direct Response Marketing for Social Media.
    
    ### 🎯 OBJECTIVE
    Synthesize a "Scroll-Stopping" ad concept that psychologically compels the target audience to stop scrolling and engage. 
    You do not write generic ideas. You engineer **Conversion Mechanisms**.

    ### 🧠 CORE THINKING FRAMEWORK (JOBS-TO-BE-DONE)
    1. **The Trigger**: What specific moment/pain causes the user to need this?
    2. **The Gap**: Why do current solutions fail them?
    3. **The Payoff**: What is the *status* or *feeling* they buy (not just the product)?

    ### 🎨 VISUAL STRATEGY RULES
    - **No "Stock Photo" Vibes**: If the concept sounds like a generic stock image, reject it.
    - **Visual Viscerality**: Describe textures, lighting, and depth. Users must "feel" the image.
    - **Pattern Interrupt**: The concept must include one element that is slightly odd, out of place, or hyper-stylized to break the feed's visual monotony.

    ### 📚 VIRAL PATTERN DATABASE
    ${viralPatternContext}

    ### 📝 OUTPUT SCHEMA REQUIREMENTS
    - **Hook**: Maximum 8 words. Must be punchy, provocative, or curiosity-inducing. No "Welcome to..." or "Buy our...".
    - **Visual Concept**: A cinematic description meant for an Art Director. Include lighting (e.g. "Rembrandt", "Hard Flash"), setting, and subject action.
    - **Color Direction**: Explicit instruction on how to grade the colors.
  `;

  const prompt = `
    ### 📋 CAMPAIGN BRIEF
    - **Product/Offer**: ${product}
    - **Value Proposition**: ${description}
    - **Target Persona**: ${audience} (Analyze their deepest fears and desires before generating)

    ${brandContext}

    ### ⚡ MISSION
    Develop ONE high-impact ad concept. 
    1. Analyze the persona's "Bleeding Neck" problem.
    2. Select the most effective psychological angle (e.g., Status, FOMO, Laziness, Revenge).
    3. Construct a visual scene that tells this story instantly without text.
    4. Write the text overlay hook that anchors the visual.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      hook: { type: Type.STRING, description: "The text overlay string. Max 8 words. High impact." },
      angle: { type: Type.STRING, description: "The specific psychological trigger used (e.g., 'Status Signaling', 'Negative Visualization')." },
      emotion: { type: Type.STRING, description: "The primary emotion triggered (e.g., Anxiety, Relief, Greed)." },
      visualConcept: { type: Type.STRING, description: "Detailed, cinematic directive for the art director. Include lighting, lens choice, and scene composition." },
      composition: { type: Type.STRING, description: "Technical composition rule (e.g., 'Center Symmetrical', 'Rule of Thirds', 'Dutch Angle')." },
      colorDirection: { type: Type.STRING, description: "Specific color grading instructions matching the Brand DNA." },
      textOverlayIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative short text hooks." },
      ctaIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 button/action text options." }
    },
    required: ["hook", "angle", "emotion", "visualConcept", "composition", "colorDirection"]
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

  if (!response.text) throw new Error("Planner Agent returned empty response");
  return JSON.parse(response.text) as PlannerOutput;
};
