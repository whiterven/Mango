import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  const key = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!key) {
    console.warn("Stripe Publishable Key missing. Billing features will run in Demo Mode.");
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};