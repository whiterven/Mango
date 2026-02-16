import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, BrandProfile, GeneratedImage } from '../types';
import { storageService } from '../services/storageService';

interface CampaignContextType {
  campaigns: Campaign[];
  brands: BrandProfile[];
  currentCampaign: Campaign | null;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  addBrand: (brand: BrandProfile) => void;
  deleteBrand: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    setCampaigns(storageService.getCampaigns());
    setBrands(storageService.getBrands());
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

  return (
    <CampaignContext.Provider value={{ 
      campaigns, 
      brands, 
      currentCampaign, 
      addCampaign, 
      updateCampaign, 
      setCurrentCampaign, 
      addBrand, 
      deleteBrand 
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
