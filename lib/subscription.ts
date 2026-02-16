
export const PLANS = {
  FREE: {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    features: ['Basic Strategy', '1 Campaign', 'Low Priority Queue']
  },
  PRO: {
    id: 'pro',
    name: 'Pro Growth',
    credits: 1000,
    features: ['Unlimited Credits', 'Competitor Spy', 'Brand Memory', 'Priority Support', 'No Watermark']
  },
  AGENCY: {
    id: 'agency',
    name: 'Agency',
    credits: 10000,
    features: ['Everything in Growth', 'Team Seats', 'API Access', 'White-label Reports', 'Dedicated Account Manager']
  }
};

export const subscription = {
  isPro: (planTier: string) => planTier === 'pro' || planTier === 'agency',
  
  getPlanDetails: (planTier: string) => {
    return Object.values(PLANS).find(p => p.id === planTier) || PLANS.FREE;
  },
  
  getLimits: (planTier: string) => {
    const isPro = planTier === 'pro' || planTier === 'agency';
    const isAgency = planTier === 'agency';
    
    return {
      canUseCompetitorSpy: isPro,
      canUseBrandMemory: isPro,
      canUseBatchMode: isAgency,
      canRemoveWatermark: isPro,
      maxVariations: isPro ? 5 : 1,
      maxDailyGenerations: isAgency ? 1000 : (isPro ? 200 : 10),
      priorityQueue: isPro
    };
  },

  checkPermission: (planTier: string, feature: 'spy' | 'batch' | 'variations' | 'high_res') => {
      const limits = subscription.getLimits(planTier);
      switch(feature) {
          case 'spy': return limits.canUseCompetitorSpy;
          case 'batch': return limits.canUseBatchMode;
          case 'variations': return limits.maxVariations > 1;
          case 'high_res': return true; // Available to all currently
          default: return false;
      }
  }
};
