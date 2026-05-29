import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICES: Record<string, string | undefined> = {
  club_month: Deno.env.get('STRIPE_PRICE_CLUB_MONTH') || 'price_1TaQ0yB9HX9AAzU4yh84q0Ho',
  club_year: Deno.env.get('STRIPE_PRICE_CLUB_YEAR') || 'price_1TaQ0yB9HX9AAzU4YztYGMnB',
  county_month: Deno.env.get('STRIPE_PRICE_COUNTY_MONTH') || 'price_1TaQ0yB9HX9AAzU4X9PLVD5C',
  county_year: Deno.env.get('STRIPE_PRICE_COUNTY_YEAR') || 'price_1TaQ0yB9HX9AAzU4njP5u9O1',
  presspass_month: Deno.env.get('STRIPE_PRICE_PRESSPASS_MONTH') || '',
  presspass_year: Deno.env.get('STRIPE_PRICE_PRESSPASS_YEAR') || '',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ trialStarted: true, message: 'Stripe not configured — trial activated.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { plan, billing, clubName, successUrl, cancelUrl } = body;

    if (plan === 'presspass') {
      return new Response(
        JSON.stringify({ error: 'Press Pass requires activation. Please contact info@clubreporter.ie.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (plan === 'free') {
      return new Response(
        JSON.stringify({ trialStarted: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const priceKey = `${plan}_${billing === 'year' ? 'year' : 'month'}`;
    const priceId = PRICES[priceKey];

    if (!priceId || priceId.includes('ADD_YOUR')) {
      return new Response(
        JSON.stringify({ error: `Billing is not configured for the ${plan} plan yet. Use Skip for now to explore the app.` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: clubName || user.email || undefined,
        metadata: { supabase_user_id: user.id, club_name: clubName || '' },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const existing = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (existing.data.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You already have an active subscription. Open Billing to manage it.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${Deno.env.get('SITE_URL') || 'https://www.clubreporter.ie'}/billing?success=1`,
      cancel_url: cancelUrl || `${Deno.env.get('SITE_URL') || 'https://www.clubreporter.ie'}/onboarding`,
      allow_promotion_codes: true,
      metadata: { plan, billing, supabase_user_id: user.id },
      subscription_data: {
        trial_period_days: plan === 'club' || plan === 'county' ? 14 : undefined,
        metadata: { plan, billing, supabase_user_id: user.id },
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Checkout failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
