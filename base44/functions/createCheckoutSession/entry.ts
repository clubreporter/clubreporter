import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const PRICES = {
  club_month:      'price_1TaQ0yB9HX9AAzU4yh84q0Ho',
  club_year:       'price_1TaQ0yB9HX9AAzU4YztYGMnB',
  county_month:    'price_1TaQ0yB9HX9AAzU4X9PLVD5C',
  county_year:     'price_1TaQ0yB9HX9AAzU4njP5u9O1',
  presspass_month: 'price_ADD_YOUR_PRESSPASS_PRICE_ID',
  presspass_year:  'price_ADD_YOUR_PRESSPASS_YEAR_PRICE_ID',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.text();
    if (!body) return Response.json({ error: 'Empty request body' }, { status: 400 });
    const { plan, billing, clubName, successUrl, cancelUrl } = JSON.parse(body);

    const priceKey = `${plan}_${billing}`;
    const priceId = PRICES[priceKey];
    if (!priceId) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name || clubName || user.email,
        metadata: { base44_user_id: user.id, club_name: clubName || '' },
      });
      customerId = customer.id;
      await base44.auth.updateMe({ stripeCustomerId: customerId });
    }

    const existing = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (existing.data.length > 0) {
      return Response.json({ error: 'Active subscription exists. Use billing portal.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://app.base44.app';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${origin}/billing?success=1`,
      cancel_url: cancelUrl || `${origin}/billing?cancel=1`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      customer_update: { address: 'auto' },
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        plan,
        billing,
        club_name: clubName || '',
      },
      subscription_data: {
        trial_period_days: plan === 'club' ? 14 : undefined,
        metadata: { plan, billing, base44_user_id: user.id },
      },
    });

    return Response.json({ url: session.url });

  } catch (err) {
    console.error('createCheckoutSession error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});