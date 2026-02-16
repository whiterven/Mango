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
      STRICT BRAND GUIDELINES (MUST FOLLOW):
      - Brand Tone: ${brand.tone}
      - Primary Color: ${brand.primaryColor} (Use this as the visual anchor/dominant accent)
      - Secondary Color: ${brand.secondaryColor}
      - Typography Vibe: ${brand.font}
      - Visual Rules: ${brand.additionalGuidelines || "Clean, high-end, professional."}
      
      You must weave these elements into the "Visual Concept" so the ad feels proprietary to the brand, not generic.
      ` 
    : "No brand kit provided. Create a cohesive visual identity based on the product niche (e.g., Cyberpunk for gaming, Minimalist for skincare).";

  // Inject viral patterns into context
  const viralPatternContext = patterns.map(p => `- ${p.name}: ${p.description} (Example: ${p.example})`).join('\n');

  const systemInstruction = `
    You are a Strategic Creative Director for high-performance paid social campaigns (Meta/TikTok).
    Your goal is to engineer ads that optimize for **Conversion Rate (CVR)** and **Click-Through Rate (CTR)**.

    **YOUR CORE FRAMEWORK:**
    
    1. **Brand DNA Integration**: 
       - Never create generic stock-photo style concepts. 
       - If the brand is "Luxury", the lighting must be moody and low-key. 
       - If the brand is "Playful", use high-key lighting and vibrant saturation.
       - The provided Brand Colors must be explicitly mentioned in the visual description (e.g., "Background wall painted in brand teal #008080").

    2. **Competitor & Trend Analysis**:
       - Assume the user's feed is saturated with competitors. 
       - **Differentiation**: If the product is usually shown in a studio, put it in a chaotic lifestyle scene. If it's usually loud, go quiet and minimalist.
       - **Pattern Interrupt**: Describe visual elements that break the grid (e.g., breaking the fourth wall, intense macro textures, surreal juxtaposition).

    3. **Direct Response Psychology**:
       - The **Hook** must target a "Bleeding Neck" problem or a "Status" desire.
       - The **Angle** must be specific (e.g., "The Us vs. Them", "The Instant Fix", "The Social Proof").

    4. **Viral Pattern Injection**:
       - You have access to a database of proven high-converting visual patterns.
       - Use these patterns if they fit the product.
    
    **AVAILABLE VIRAL PATTERNS:**
    ${viralPatternContext}

    **OUTPUT RULES**:
    - "Visual Concept": Describe the scene cinematically. Include lighting, texture, and depth.
    - "Hook": Max 8 words. Punchy. No fluff.
  `;

  const prompt = `
    CLIENT BRIEF:
    Product: ${product}
    Value Prop: ${description}
    Target Audience: ${audience}

    ${brandContext}

    Develop a conversion-optimized ad concept.
    Focus on a "Scroll-Stopping" visual that a user creates a visceral reaction to.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      hook: { type: Type.STRING, description: "The text overlay hook (max 8 words)." },
      angle: { type: Type.STRING, description: "The psychological angle used." },
      emotion: { type: Type.STRING, description: "The primary emotion triggered (e.g., FOMO, Relief)." },
      visualConcept: { type: Type.STRING, description: "Detailed cinematic description of the scene, lighting, and brand color integration." },
      composition: { type: Type.STRING, description: "Specific composition rule (e.g., Golden Ratio, Center Symmetrical, Dutch Angle)." },
      colorDirection: { type: Type.STRING, description: "How the brand colors and lighting mood are applied." },
      textOverlayIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
      ctaIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["hook", "angle", "visualConcept", "composition", "colorDirection"]
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