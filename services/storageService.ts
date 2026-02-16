
import { BrandProfile, Campaign, CompetitorEntry } from "../types";

const KEYS = {
  BRANDS: 'mango_brands',
  CAMPAIGNS: 'mango_campaigns',
  COMPETITORS: 'mango_competitors'
};

export const storageService = {
  saveBrand: (brand: BrandProfile) => {
    const brands = storageService.getBrands();
    const existingIndex = brands.findIndex(b => b.id === brand.id);
    if (existingIndex >= 0) {
      brands[existingIndex] = brand;
    } else {
      brands.push(brand);
    }
    localStorage.setItem(KEYS.BRANDS, JSON.stringify(brands));
  },

  getBrands: (): BrandProfile[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.BRANDS) || '[]');
    } catch {
      return [];
    }
  },

  deleteBrand: (id: string) => {
    const brands = storageService.getBrands().filter(b => b.id !== id);
    localStorage.setItem(KEYS.BRANDS, JSON.stringify(brands));
  },

  saveCampaign: (campaign: Campaign) => {
    const campaigns = storageService.getCampaigns();
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    if (existingIndex >= 0) {
      campaigns[existingIndex] = campaign;
    } else {
      campaigns.unshift(campaign); // Newest first
    }
    localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  },

  getCampaigns: (): Campaign[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CAMPAIGNS) || '[]');
    } catch {
      return [];
    }
  },

  saveCompetitor: (competitor: CompetitorEntry) => {
    const competitors = storageService.getCompetitors();
    const existingIndex = competitors.findIndex(c => c.id === competitor.id);
    if (existingIndex >= 0) {
      competitors[existingIndex] = competitor;
    } else {
      competitors.unshift(competitor);
    }
    localStorage.setItem(KEYS.COMPETITORS, JSON.stringify(competitors));
  },

  getCompetitors: (): CompetitorEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.COMPETITORS) || '[]');
    } catch {
      return [];
    }
  },

  deleteCompetitor: (id: string) => {
    const competitors = storageService.getCompetitors().filter(c => c.id !== id);
    localStorage.setItem(KEYS.COMPETITORS, JSON.stringify(competitors));
  }
};
