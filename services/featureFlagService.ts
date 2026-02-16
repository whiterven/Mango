
const DEFAULT_FLAGS = {
  ENABLE_DB_SYNC: true,
  ENABLE_HIGH_RES: true,
  ENABLE_COMPETITOR_ANALYSIS: true
};

export const featureFlagService = {
  isEnabled: (flag: keyof typeof DEFAULT_FLAGS): boolean => {
    // In a real app, this could check Supabase 'feature_flags' table
    return DEFAULT_FLAGS[flag];
  }
};
