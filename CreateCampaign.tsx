import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AgentPipeline } from '../components/AgentPipeline';
import { CreativeControls } from '../components/CreativeControls';
import { SceneBuilder } from '../components/SceneBuilder';
import { useCampaignStore } from '../store/CampaignContext';
import { plannerAgent } from '../agents/plannerAgent';
import { directorAgent } from '../agents/directorAgent';
import { imageAgent } from '../agents/imageAgent';
import { scraperAgent } from '../agents/scraperAgent';
import { competitorAgent } from '../agents/competitorAgent';
import { fileToBase64 } from '../services/geminiService';
import { Campaign, CampaignStatus, PlannerOutput, DirectorOutput, AspectRatio, BrandProfile, ImageSize, CreativeControls as CreativeControlsType, CompetitorAnalysis, SceneConfiguration } from '../types';

export const CreateCampaign: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addCampaign, brands } = useCampaignStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  