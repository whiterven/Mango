
import { getSupabaseClient } from '../../lib/supabase';
import { UserCredit } from '../../types/database';

const CREDIT_KEY = 'mango_credits';

export const billingService = {
  getCredits: async (userId: string): Promise<UserCredit> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) return data;
    }

    const local = localStorage.getItem(CREDIT_KEY);
    return local ? JSON.parse(local) : {
      user_id: userId,
      total_credits: 50,
      used_credits: 0,
      plan_tier: 'starter',
      history: [],
      updated_at: new Date().toISOString()
    };
  },

  deductCredits: async (userId: string, amount: number, reason: string): Promise<boolean> => {
    const current = await billingService.getCredits(userId);
    
    if (current.used_credits + amount > current.total_credits) {
      return false;
    }

    const updates = {
      used_credits: current.used_credits + amount,
      history: [...(current.history || []), { 
        date: new Date().toISOString(), 
        amount, 
        action: reason 
      }],
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('user_credits')
        .update(updates)
        .eq('user_id', userId);
        
      if (error) {
        console.error("Credit deduction failed", error);
        return false; // Transaction failed
      }
      return true;
    }

    // Local
    const newCreditState = { ...current, ...updates };
    localStorage.setItem(CREDIT_KEY, JSON.stringify(newCreditState));
    return true;
  }
};
