
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  font: string;
  tone: string;
  logo_url?: string;
  guidelines?: string;
  created_at: string;
  deleted_at?: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  brand_id?: string;
  name: string;
  product_name: string;
  description: string;
  target_audience: string;
  goal: string;
  platform: string;
  status: 'draft' | 'planning' | 'directing' | 'generating' | 'completed' | 'failed';
  creative_controls: any;
  scene_configuration: any;
  competitor_analysis: any;
  planner_output: any;
  director_output: any;
  ad_copy: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface GeneratedImage {
  id: string;
  campaign_id: string;
  user_id: string;
  url: string;
  storage_path?: string;
  prompt: string;
  aspect_ratio: string;
  created_at: string;
}

export interface Competitor {
  id: string;
  user_id: string;
  name: string;
  analysis: any;
  image_url?: string;
  created_at: string;
}

export interface UserCredit {
  user_id: string;
  total_credits: number;
  used_credits: number;
  plan_tier: 'starter' | 'pro' | 'agency';
  history: any[];
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  created_at: string;
}
