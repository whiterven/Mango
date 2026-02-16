
export interface AdHook {
  id: string;
  text: string;
  category: 'fear' | 'curiosity' | 'benefit' | 'social_proof' | 'urgency';
  performanceScore: number;
}

export const adHooks: AdHook[] = [
  { id: 'h1', text: "Stop doing [Blank] if you want [Result].", category: 'fear', performanceScore: 92 },
  { id: 'h2', text: "The exact routine I used to [Result].", category: 'curiosity', performanceScore: 88 },
  { id: 'h3', text: "Why [Competitor] is silently failing you.", category: 'fear', performanceScore: 85 },
  { id: 'h4', text: "3 signs your [Body Part/Business] needs help.", category: 'fear', performanceScore: 81 },
  { id: 'h5', text: "Finally. A [Product] that actually works.", category: 'benefit', performanceScore: 95 },
  { id: 'h6', text: "Don't buy this unless you hate [Negative Outcome].", category: 'curiosity', performanceScore: 89 },
  { id: 'h7', text: "POV: You finally fixed your [Problem].", category: 'benefit', performanceScore: 90 },
  { id: 'h8', text: "My husband thinks I'm crazy for buying this...", category: 'social_proof', performanceScore: 84 },
  { id: 'h9', text: "Last chance to grab the [Product] bundle.", category: 'urgency', performanceScore: 78 },
  { id: 'h10', text: "What [Industry Experts] aren't telling you.", category: 'curiosity', performanceScore: 91 },
  { id: 'h11', text: "If you can only buy one [Category] this year...", category: 'urgency', performanceScore: 87 },
  { id: 'h12', text: "The unfair advantage for [Target Audience].", category: 'benefit', performanceScore: 86 }
];
