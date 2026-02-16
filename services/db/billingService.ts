
import { getSupabaseClient } from '../../lib/supabase';
import { getStripe } from '../../lib/stripe';
import { UserCredit } from '../../types/database';

const CREDIT_KEY = 'mango_credits';

export const billingService = {
  // --- Data Access ---

  getCredits: async (userId: string): Promise<UserCredit> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) return data;
      // If no record exists remotely, create one default
      if (error && error.code === 'PGRST116') {
          // Attempt initialization handled by trigger, but fail-safe here
          return {
              user_id: userId,
              total_credits: 50,
              used_credits: 0,
              plan_tier: 'starter',
              history: [],
              updated_at: new Date().toISOString()
          };
      }
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

  // --- Transactions ---

  /**
   * Deducts credits for an action.
   * Returns FALSE if insufficient funds.
   */
  deductCredits: async (userId: string, amount: number, reason: string): Promise<boolean> => {
    const current = await billingService.getCredits(userId);
    
    // Check balance
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

    // Local Fallback
    const newCreditState = { ...current, ...updates };
    localStorage.setItem(CREDIT_KEY, JSON.stringify(newCreditState));
    return true;
  },

  // --- Stripe Integration ---

  startSubscription: async (priceId: string) => {
    const supabase = getSupabaseClient();
    
    // Offline Mode Mock
    if (!supabase) {
        alert("Demo Mode: Subscription 'purchased' successfully! (No charge)");
        const current = JSON.parse(localStorage.getItem(CREDIT_KEY) || '{}');
        current.plan_tier = priceId.includes('agency') ? 'agency' : 'pro';
        current.total_credits = priceId.includes('agency') ? 10000 : 1000;
        localStorage.setItem(CREDIT_KEY, JSON.stringify(current));
        window.location.reload();
        return;
    }

    // Get current user to attach to metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please log in to purchase.");
        return;
    }

    // Real Stripe Checkout
    try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { priceId, mode: 'subscription', userId: user.id }
        });
        
        if (error) throw error;
        
        const stripe = await getStripe();
        if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
    } catch (e) {
        console.error("Checkout failed:", e);
        alert("Failed to initiate checkout. Check console for details.");
    }
  },

  buyCreditPack: async (priceId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
        alert("Demo Mode: Credits added! (No charge)");
        const current = JSON.parse(localStorage.getItem(CREDIT_KEY) || '{}');
        current.total_credits += 500;
        localStorage.setItem(CREDIT_KEY, JSON.stringify(current));
        window.location.reload();
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { priceId, mode: 'payment', userId: user.id }
        });
        if (error) throw error;
        
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (e) {
        console.error("Credit purchase failed:", e);
    }
  },

  openBillingPortal: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
        alert("Demo Mode: This would open the Stripe Customer Portal.");
        return;
    }

    try {
        const { data, error } = await supabase.functions.invoke('create-portal');
        if (error) throw error;
        window.location.href = data.url;
    } catch (e) {
        console.error("Portal failed:", e);
    }
  }
};
