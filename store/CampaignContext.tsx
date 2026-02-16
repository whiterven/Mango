
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, BrandProfile, CompetitorEntry } from '../types';
import { campaignService } from '../services/db/campaignService';
import { brandService } from '../services/db/brandService';
import { creativeService } from '../services/db/creativeService';
import { useAuth } from '../hooks/useAuth';

interface CampaignContextType {
  campaigns: Campaign[];
  brands: BrandProfile[];
  competitors: CompetitorEntry[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (campaign: Campaign) => Promise<void>;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  addBrand: (brand: BrandProfile) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  addCompetitor: (competitor: CompetitorEntry) => Promise<void>;
  deleteCompetitor: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [camps, brs, comps] = await Promise.all([
        campaignService.getCampaigns(user.id),
        brandService.getBrands(user.id),
        creativeService.getCompetitors(user.id)
      ]);
      setCampaigns(camps);
      setBrands(brs);
      setCompetitors(comps);
    } catch (e) {
      console.error("Failed to refresh data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Clear or load default offline data if no user (though useAuth mocks a user for offline)
      setCampaigns([]);
      setBrands([]);
      setCompetitors([]);
      setIsLoading(false);
    }
  }, [user?.id]);

  const addCampaign = async (campaign: Campaign) => {
    if (!user) return;
    // Optimistic Update
    setCampaigns(prev => [campaign, ...prev]);
    setCurrentCampaign(campaign);
    await campaignService.createCampaign(campaign, user.id);
  };

  const updateCampaign = async (campaign: Campaign) => {
    if (!user) return;
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
    if (currentCampaign?.id === campaign.id) {
      setCurrentCampaign(campaign);
    }
    await campaignService.updateCampaign(campaign, user.id);
  };

  const addBrand = async (brand: BrandProfile) => {
    if (!user) return;
    setBrands(prev => {
        const idx = prev.findIndex(b => b.id === brand.id);
        if (idx >= 0) {
            const newBrands = [...prev];
            newBrands[idx] = brand;
            return newBrands;
        }
        return [...prev, brand];
    });
    await brandService.saveBrand(brand, user.id);
  };

  const deleteBrand = async (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    await brandService.deleteBrand(id);
  };

  const addCompetitor = async (competitor: CompetitorEntry) => {
    if (!user) return;
    setCompetitors(prev => [competitor, ...prev]);
    await creativeService.saveCompetitor(competitor, user.id);
  };

  const deleteCompetitor = async (id: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    await creativeService.deleteCompetitor(id);
  };

  return (
    <CampaignContext.Provider value={{ 
      campaigns, 
      brands, 
      competitors,
      currentCampaign, 
      isLoading,
      addCampaign, 
      updateCampaign, 
      setCurrentCampaign, 
      addBrand, 
      deleteBrand,
      addCompetitor,
      deleteCompetitor,
      refreshData
    }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignStore = () => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error("useCampaignStore must be used within CampaignProvider");
  return context;
};
