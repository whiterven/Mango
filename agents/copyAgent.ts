
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
    You are a **Legendary Direct Response Copywriter**.
    You do not write "content". You write **Sales Copy**.
    
    ### 📢 PLATFORM RULES (STRICT)
    
    **FACEBOOK / INSTAGRAM FEED**:
    - **Structure**: "Hook (1 line) -> Line Break -> Agitate Pain -> Solution -> Bullets -> CTA".
    - **Tone**: Conversational, personal, slightly informal (like a friend recommending a product).
    - **Emojis**: Use tastefully to break up text blocks.
    - **Length**: Medium-Long (Storytelling works).

    **INSTAGRAM STORY / TIKTOK CAPTION**:
    - **Structure**: Extremely short. Punchy.
    - **Tone**: Hype, urgent, or meme-style.
    - **Length**: Under 150 characters ideal.

    **LINKEDIN**:
    - **Tone**: Professional, insight-driven, "Thought Leader".
    - **Focus**: ROI, efficiency, career growth, business status.
    - **No**: Slang, excessive emojis.

    ### ✍️ COPYWRITING FORMULAS TO USE
    1. **PAS**: Problem, Agitation, Solution.
    2. **AIDA**: Attention, Interest, Desire, Action.
    3. **FAB**: Features, Advantages, Benefits.

    *Constraint*: The "Headline" must be under 40 characters to fit on mobile ad buttons.
  `;

  const prompt = `
    ### 📝 CAMPAIGN DATA
    - **Product**: ${productName}
    - **Audience**: ${audience}
    - **Platform**: ${platform} (FORMAT FOR THIS SPECIFICALLY)
    - **Strategic Hook**: "${plannerOutput.hook}"
    - **Emotional Angle**: ${plannerOutput.emotion}
    
    ### 🎯 TASK
    Write the ad copy package.
    1. **Headline**: The bold text near the button.
    2. **Primary Text**: The main caption/body.
    3. **CTA**: The specific button text (e.g., Shop Now, Learn More).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      headline: { type: Type.STRING, description: "Bold, benefit-driven headline (max 40 chars)." },
      primaryText: { type: Type.STRING, description: "The main body copy formatted with line breaks." },
      cta: { type: Type.STRING, description: "Best performing standard CTA button text." }
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
