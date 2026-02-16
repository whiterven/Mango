
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.4.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId || session.client_reference_id;
      const stripeCustomerId = session.customer;
      
      if (userId) {
          // Update Stripe Customer ID mapping
          await supabase.from('user_credits').update({
              stripe_customer_id: stripeCustomerId,
              updated_at: new Date().toISOString()
          }).eq('user_id', userId);

          const mode = session.mode;
          
          if (mode === 'subscription') {
              await supabase.from('user_credits').upsert({
                  user_id: userId,
                  stripe_customer_id: stripeCustomerId,
                  plan_tier: 'pro',
                  total_credits: 1000, 
                  updated_at: new Date().toISOString()
              });
              
              await supabase.from('activity_logs').insert({
                  user_id: userId,
                  action: 'Subscription Upgrade',
                  details: { plan: 'pro', sessionId: session.id }
              });

          } else if (mode === 'payment') {
              const { data: current } = await supabase
                  .from('user_credits')
                  .select('total_credits')
                  .eq('user_id', userId)
                  .single();
                  
              const newTotal = (current?.total_credits || 0) + 500;
              
              await supabase.from('user_credits').update({
                  total_credits: newTotal,
                  updated_at: new Date().toISOString()
              }).eq('user_id', userId);

              await supabase.from('activity_logs').insert({
                  user_id: userId,
                  action: 'Purchased Credits',
                  details: { amount: 500, sessionId: session.id }
              });
          }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;
      
      // Find user by customer ID
      const { data: userCredit } = await supabase
          .from('user_credits')
          .select('user_id')
          .eq('stripe_customer_id', stripeCustomerId)
          .single();

      if (userCredit) {
          await supabase.from('user_credits').update({
              plan_tier: 'starter',
              total_credits: 50,
              updated_at: new Date().toISOString()
          }).eq('user_id', userCredit.user_id);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
