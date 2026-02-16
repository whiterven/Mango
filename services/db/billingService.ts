
import { getSupabaseClient } from '../../lib/supabase';
import { getStripe } from '../../lib/stripe';
import { UserCredit } from '../../types/database';

export const billingService = {
  // --- Data Access ---

  getCredits: async (userId: string): Promise<UserCredit> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required for billing");

    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) return data;
    
    // If no record exists remotely, create one default
    if (error && error.code === 'PGRST116') {
        const defaultCredits = {
            user_id: userId,
            total_credits: 50,
            used_credits: 0,
            plan_tier: 'starter',
            history: [],
            updated_at: new Date().toISOString()
        };
        // Attempt to init (best effort)
        await supabase.from('user_credits').insert(defaultCredits);
        return defaultCredits as UserCredit;
    }
    
    throw error;
  },

  // --- Transactions ---

  deductCredits: async (userId: string, amount: number, reason: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

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

    const { error } = await supabase
      .from('user_credits')
      .update(updates)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Credit deduction failed", error);
      return false;
    }
    return true;
  },

  // --- Stripe Integration ---

  startSubscription: async (priceId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please log in to purchase.");
        return;
    }

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

  openBillingPortal: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    try {
        const { data, error } = await supabase.functions.invoke('create-portal');
        if (error) throw error;
        window.location.href = data.url;
    } catch (e) {
        console.error("Portal failed:", e);
    }
  }
};
