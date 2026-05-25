import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const customerId = user.stripeCustomerId;
    if (!customerId) return Response.json({ error: 'No billing account found' }, { status: 404 });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (subscriptions.data.length === 0) {
      return Response.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const body = await req.text();
    const { returnUrl } = body ? JSON.parse(body) : {};
    const origin = req.headers.get('origin') || 'https://app.base44.app';
    const return_url = returnUrl || `${origin}/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url,
    });

    return Response.json({ url: session.url });

  } catch (err) {
    console.error('getBillingPortalUrl error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});