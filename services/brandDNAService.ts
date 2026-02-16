import { BrandProfile } from "../types";

export const brandDNAService = {
  // Check if a prompt violates brand rules (Regex based for simplicity)
  validateCompliance: (prompt: string, brand: BrandProfile): string[] => {
    const violations: string[] = [];
    
    // Example rule: Check if competitor colors are mentioned (mock logic)
    if (prompt.toLowerCase().includes('neon') && brand.tone === 'Luxury') {
      violations.push("Luxury brands should avoid 'neon' keywords.");
    }

    return violations;
  },

  // Generate a system instruction block for agents
  getSystemInstruction: (brand: BrandProfile): string => {
    return `
      BRAND DNA ENFORCEMENT:
      You are acting on behalf of ${brand.name}.
      TONE: ${brand.tone}
      FONTS: ${brand.font}
      COLORS: Primary ${brand.primaryColor}, Secondary ${brand.secondaryColor}.
      
      GUIDELINES:
      ${brand.additionalGuidelines || "Maintain a consistent, professional look."}
      
      Do not deviate from this identity.
    `;
  }
};