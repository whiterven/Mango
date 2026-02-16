
import { BrandProfile, Campaign, CompetitorEntry, GeneratedImage } from "../../types";
import { Campaign as DbCampaign, Brand as DbBrand, Competitor as DbCompetitor, GeneratedImage as DbImage } from "../../types/database";

/**
 * Converts ISO DB strings to App Timestamps (number)
 * Converts snake_case keys to camelCase
 */

export const mapCampaignFromDb = (db: DbCampaign, images: DbImage[] = []): Campaign => {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    productName: db.product_name,
    description: db.description,
    targetAudience: db.target_audience,
    goal: db.goal,
    platform: db.platform as any,
    brandProfileId: db.brand_id,
    status: db.status as any,
    createdAt: new Date(db.created_at).getTime(),
    updatedAt: new Date(db.updated_at).getTime(),
    
    creativeControls: db.creative_controls,
    sceneConfiguration: db.scene_configuration,
    competitorAnalysis: db.competitor_analysis,
    aspectRatio: undefined, // Usually derived from images or settings, fallback handling needed
    
    plannerOutput: db.planner_output,
    directorOutput: db.director_output,
    adCopy: db.ad_copy,
    
    images: images.map(mapImageFromDb)
  };
};

export const mapCampaignToDb = (app: Campaign, userId: string): Partial<DbCampaign> => {
  return {
    id: app.id,
    user_id: userId,
    brand_id: app.brandProfileId,
    name: app.name,
    product_name: app.productName,
    description: app.description,
    target_audience: app.targetAudience,
    goal: app.goal,
    platform: app.platform,
    status: app.status,
    // JSONB fields
    creative_controls: app.creativeControls,
    scene_configuration: app.sceneConfiguration,
    competitor_analysis: app.competitorAnalysis,
    planner_output: app.plannerOutput,
    director_output: app.directorOutput,
    ad_copy: app.adCopy,
    
    created_at: new Date(app.createdAt).toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const mapBrandFromDb = (db: DbBrand): BrandProfile => ({
  id: db.id,
  userId: db.user_id,
  name: db.name,
  primaryColor: db.primary_color,
  secondaryColor: db.secondary_color,
  font: db.font,
  tone: db.tone,
  logo: db.logo_url,
  additionalGuidelines: db.guidelines,
  createdAt: new Date(db.created_at).getTime()
});

export const mapBrandToDb = (app: BrandProfile, userId: string): Partial<DbBrand> => ({
  id: app.id,
  user_id: userId,
  name: app.name,
  primary_color: app.primaryColor,
  secondary_color: app.secondaryColor,
  font: app.font,
  tone: app.tone,
  logo_url: app.logo,
  guidelines: app.additionalGuidelines,
  created_at: app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString()
});

export const mapCompetitorFromDb = (db: DbCompetitor): CompetitorEntry => ({
  id: db.id,
  userId: db.user_id,
  name: db.name,
  analysis: db.analysis,
  imageUrl: db.image_url,
  createdAt: new Date(db.created_at).getTime()
});

export const mapCompetitorToDb = (app: CompetitorEntry, userId: string): Partial<DbCompetitor> => ({
  id: app.id,
  user_id: userId,
  name: app.name,
  analysis: app.analysis,
  image_url: app.imageUrl,
  created_at: new Date(app.createdAt).toISOString()
});

export const mapImageFromDb = (db: DbImage): GeneratedImage => ({
  id: db.id,
  campaignId: db.campaign_id,
  userId: db.user_id,
  url: db.url,
  prompt: db.prompt,
  aspectRatio: db.aspect_ratio as any,
  storagePath: db.storage_path,
  createdAt: new Date(db.created_at).getTime()
});

export const mapImageToDb = (app: GeneratedImage, campaignId: string, userId: string): Partial<DbImage> => ({
  id: app.id,
  campaign_id: campaignId,
  user_id: userId,
  url: app.url,
  storage_path: app.storagePath,
  prompt: app.prompt,
  aspect_ratio: app.aspectRatio,
  created_at: new Date(app.createdAt).toISOString()
});
