import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const customerId = user.stripeCustomerId;
    if (!customerId) {
      return Response.json({ status: 'none', plan: null, billing: null });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 5,
    });

    const active = subscriptions.data.find(s =>
      s.status === 'active' || s.status === 'trialing'
    );

    if (!active) {
      const past = subscriptions.data.find(s => s.status === 'past_due');
      if (past) {
        return Response.json({
          status: 'past_due',
          plan: past.metadata?.plan || null,
          billing: past.metadata?.billing || null,
          currentPeriodEnd: past.current_period_end,
        });
      }
      return Response.json({ status: 'none', plan: null, billing: null });
    }

    const invoices = await stripe.invoices.list({ customer: customerId, limit: 10 });

    const trialDaysRemaining = active.trial_end
      ? Math.ceil((active.trial_end - Date.now() / 1000) / 86400)
      : null;

    let nextPaymentAmount = null;
    let nextPaymentDate = null;
    try {
      const upcoming = await stripe.invoices.retrieveUpcoming({ customer: customerId });
      nextPaymentAmount = upcoming.amount_due;
      nextPaymentDate = upcoming.next_payment_attempt;
    } catch (_) {}

    return Response.json({
      status: active.status,
      plan: active.metadata?.plan || null,
      billing: active.metadata?.billing || null,
      currentPeriodEnd: active.current_period_end,
      cancelAtPeriodEnd: active.cancel_at_period_end,
      trialEnd: active.trial_end,
      trialDaysRemaining,
      nextPaymentAmount,
      nextPaymentDate,
      invoices: invoices.data
        .filter(inv => inv.invoice_pdf)
        .map(inv => ({
          id: inv.id,
          date: inv.created,
          amount: inv.amount_paid,
          currency: inv.currency,
          status: inv.status,
          pdf: inv.invoice_pdf,
        })),
    });

  } catch (err) {
    console.error('getSubscriptionStatus error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});