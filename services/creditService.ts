
import { billingService } from './db/billingService';

export interface CreditState {
  total: number;
  used: number;
  plan: 'starter' | 'pro' | 'agency';
  history: { date: string, amount: number, action: string }[];
}

export const creditService = {
  /**
   * Refreshes and returns the current credit state for the UI
   */
  getState: async (userId: string): Promise<CreditState> => {
    const data = await billingService.getCredits(userId);
    
    // Ensure history is an array
    const history = Array.isArray(data.history) ? data.history : [];

    return {
      total: data.total_credits,
      used: data.used_credits,
      plan: data.plan_tier,
      history: history.reverse() // Newest first
    };
  },

  /**
   * Check if user has enough credits
   */
  hasCredits: async (userId: string, cost: number): Promise<boolean> => {
    const data = await billingService.getCredits(userId);
    return (data.total_credits - data.used_credits) >= cost;
  },

  /**
   * Deduct credits
   */
  deduct: async (userId: string, amount: number, reason: string): Promise<boolean> => {
    return await billingService.deductCredits(userId, amount, reason);
  }
};
