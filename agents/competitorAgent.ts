
import { Type, Schema } from "@google/genai";
import { getAiClient } from "../services/aiService";
import { CompetitorAnalysis } from "../types";

/**
 * Analyzes a competitor via Image (Base64) or Website URL.
 */
export const competitorAgent = async (
  input: string, 
  inputType: 'image' | 'url'
): Promise<CompetitorAnalysis> => {
  const ai = getAiClient();

  const systemInstruction = `
    You are a **Competitive Intelligence Officer**.
    Your job is to **reverse-engineer** competitor marketing to find cracks in their armor.
    
    ### 🕵️ ANALYSIS FRAMEWORK
    1. **Visual/Brand Audit**: Identify their "Vibe". Is it Corporate? DTC Startup? dropshipper cheap? Luxury?
    2. **Hook Detection**: What is the *single* big idea they are pushing? (e.g., "It's faster", "It's cheaper", "Status symbol").
    3. **The 'Kill' Strategy (Gap Analysis)**:
       - If they are **Cheap** -> We pivot to **Quality/Premium**.
       - If they are **Complex** -> We pivot to **Simplicity**.
       - If they are **Boring** -> We pivot to **Entertainment**.
       - If they are **Generic** -> We pivot to **Specific Identity**.

    *Constraint*: Be critical. Don't just describe. Judge.
  `;

  let prompt = "";
  let contents: any = {};
  let tools: any[] = [];

  if (inputType === 'url') {
    prompt = `
      TARGET URL: ${input}
      
      1. Scrape the landing page or ad destination.
      2. Identify their Core Value Proposition.
      3. Find 3 specific weaknesses in their copy, design, or offer structure.
      4. Define a "Counter-Strategy" to beat them.
    `;
    contents = { role: "user", parts: [{ text: prompt }] };
    tools = [{ googleSearch: {} }];
  } else {
    prompt = `
      TARGET IMAGE: (See attachment)
      
      1. Deconstruct the visual hierarchy. What captures attention first?
      2. Critique the aesthetic. Does it look professional? Amateur? 
      3. Identify 3 weaknesses (e.g., "Text is hard to read", "Stock photo look", "Weak hook").
      4. Define a "Winning Angle" to create a superior creative.
    `;
    contents = {
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: input } }
      ]
    };
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      visualStyle: { type: Type.STRING, description: "Description of the competitor's aesthetic and tone." },
      detectedHook: { type: Type.STRING, description: "The core selling proposition or hook identified." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 strategic or creative flaws to exploit." },
      opportunityAngle: { type: Type.STRING, description: "The specific differentiation strategy to outperform them." }
    },
    required: ["visualStyle", "detectedHook", "weaknesses", "opportunityAngle"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for deeper reasoning
    contents: contents,
    config: {
      systemInstruction,
      tools: tools.length > 0 ? tools : undefined,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("Competitor Agent returned empty response");
  return JSON.parse(response.text) as CompetitorAnalysis;
};
