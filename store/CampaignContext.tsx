
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, BrandProfile, GeneratedImage, CompetitorEntry } from '../types';
import { storageService } from '../services/storageService';

interface CampaignContextType {
  campaigns: Campaign[];
  brands: BrandProfile[];
  competitors: CompetitorEntry[];
  currentCampaign: Campaign | null;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  addBrand: (brand: BrandProfile) => void;
  deleteBrand: (id: string) => void;
  addCompetitor: (competitor: CompetitorEntry) => void;
  deleteCompetitor: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    setCampaigns(storageService.getCampaigns());
    setBrands(storageService.getBrands());
    setCompetitors(storageService.getCompetitors());
  }, []);

  const addCampaign = (campaign: Campaign) => {
    const updated = [campaign, ...campaigns];
    setCampaigns(updated);
    storageService.saveCampaign(campaign);
    setCurrentCampaign(campaign);
  };

  const updateCampaign = (campaign: Campaign) => {
    const updated = campaigns.map(c => c.id === campaign.id ? campaign : c);
    setCampaigns(updated);
    storageService.saveCampaign(campaign);
    if (currentCampaign?.id === campaign.id) {
      setCurrentCampaign(campaign);
    }
  };

  const addBrand = (brand: BrandProfile) => {
    const updated = [...brands, brand];
    setBrands(updated);
    storageService.saveBrand(brand);
  };

  const deleteBrand = (id: string) => {
    const updated = brands.filter(b => b.id !== id);
    setBrands(updated);
    storageService.deleteBrand(id);
  };

  const addCompetitor = (competitor: CompetitorEntry) => {
    const updated = [competitor, ...competitors];
    setCompetitors(updated);
    storageService.saveCompetitor(competitor);
  };

  const deleteCompetitor = (id: string) => {
    const updated = competitors.filter(c => c.id !== id);
    setCompetitors(updated);
    storageService.deleteCompetitor(id);
  };

  return (
    <CampaignContext.Provider value={{ 
      campaigns, 
      brands, 
      competitors,
      currentCampaign, 
      addCampaign, 
      updateCampaign, 
      setCurrentCampaign, 
      addBrand, 
      deleteBrand,
      addCompetitor,
      deleteCompetitor
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
