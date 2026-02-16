
import { patterns } from "../data/adPatterns";
import { ViralPattern } from "../types";

export const patternService = {
  getAllPatterns: (): ViralPattern[] => {
    return patterns;
  },

  getPatternById: (id: string): ViralPattern | undefined => {
    return patterns.find(p => p.id === id);
  },

  getPatternsByCategory: (category: ViralPattern['category']): ViralPattern[] => {
    return patterns.filter(p => p.category === category);
  },

  recommendPattern: (industry: string, goal: string): ViralPattern => {
    // Simple logic for now, can be expanded with AI
    if (goal === 'Awareness') return patterns.find(p => p.id === 'v1') || patterns[0]; // Green Screen
    if (goal === 'Sales') return patterns.find(p => p.id === 'v2') || patterns[1]; // Us vs Them
    if (industry === 'SaaS') return patterns.find(p => p.id === 'v8') || patterns[7]; // Fake UI
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
};
