
export type Platform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok';
export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';
export type CampaignStatus = 'draft' | 'planning' | 'directing' | 'generating' | 'completed' | 'failed';

export interface BrandProfile {
  id: string;
  userId?: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  fontStyle?: string;
  tone: string;
  website?: string;
  logo?: string; 
  additionalGuidelines?: string;
  createdAt?: number;
}

export interface CreativeControls {
  minimalism: number; // 0-100
  vibrancy: number; // 0-100
  lightingDrama: number; // 0-100
  mood: 'luxury' | 'energetic' | 'trustworthy' | 'edgy';
}

export interface SceneConfiguration {
  background: string;
  lighting: string;
  cameraAngle: string;
  props: string[];
  subjectPose: string;
}

export interface CompetitorAnalysis {
  visualStyle: string;
  detectedHook: string;
  weaknesses: string[];
  opportunityAngle: string;
}

export interface CompetitorEntry {
  id: string;
  userId?: string;
  name: string;
  analysis: CompetitorAnalysis;
  createdAt: number;
  imageUrl?: string; 
}

export interface AdCopy {
  headline: string;
  primaryText: string;
  cta: string;
}

export interface PlannerOutput {
  hook: string;
  angle: string;
  emotion: string;
  visualConcept: string;
  composition: string;
  colorDirection: string;
  textOverlayIdeas: string[];
  ctaIdeas: string[];
  competitorContrast?: string;
}

export interface DirectorOutput {
  improvedConcept: string;
  technicalPrompt: string;
  generationPrompts: string[]; 
  creativeStrength: {
    attention: number;
    clarity: number;
    conversion: number;
    overall: number;
    reasoning: string;
  };
  variations: {
    angle: string;
    promptAdjustment: string;
  }[];
}

export interface GeneratedImage {
  id: string;
  campaignId?: string;
  userId?: string;
  url: string; 
  prompt: string;
  aspectRatio: AspectRatio;
  createdAt: number;
  storagePath?: string;
}

export interface Campaign {
  id: string;
  userId?: string;
  name: string;
  productName: string;
  description: string;
  targetAudience: string;
  goal: string;
  platform: Platform;
  brandProfileId?: string;
  status: CampaignStatus;
  createdAt: number;
  updatedAt?: number;
  
  // Settings
  creativeControls?: CreativeControls;
  sceneConfiguration?: SceneConfiguration;
  competitorAnalysis?: CompetitorAnalysis;
  aspectRatio?: AspectRatio;
  
  // Pipeline Data
  plannerOutput?: PlannerOutput;
  directorOutput?: DirectorOutput;
  adCopy?: AdCopy;
  images: GeneratedImage[];
}

export interface ViralPattern {
  id: string;
  name: string;
  description: string;
  example: string;
  category: 'hook' | 'visual' | 'psychology';
}

export interface SavedTemplate {
  id: string;
  name: string;
  prompt: string;
  category: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
