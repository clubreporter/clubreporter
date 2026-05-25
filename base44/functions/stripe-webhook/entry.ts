import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const meta = session.metadata || {};
      const customerId = session.customer;

      // Find user by stripeCustomerId
      const users = await base44.asServiceRole.entities.User.filter({ stripeCustomerId: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscriptionPlan: meta.plan || 'basic',
          subscriptionBilling: meta.billing || 'month',
          subscriptionStatus: 'active',
          stripeCustomerId: customerId,
        });
        console.log(`Activated ${meta.plan} plan for user ${users[0].id}`);
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const customerId = sub.customer;
      const users = await base44.asServiceRole.entities.User.filter({ stripeCustomerId: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscriptionPlan: sub.metadata?.plan || users[0].subscriptionPlan,
          subscriptionBilling: sub.metadata?.billing || users[0].subscriptionBilling,
          subscriptionStatus: sub.status,
        });
        console.log(`Updated subscription to ${sub.status} for user ${users[0].id}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const customerId = sub.customer;
      const users = await base44.asServiceRole.entities.User.filter({ stripeCustomerId: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscriptionStatus: 'canceled',
        });
        console.log(`Canceled subscription for user ${users[0].id}`);
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const inv = event.data.object;
      const customerId = inv.customer;
      const users = await base44.asServiceRole.entities.User.filter({ stripeCustomerId: customerId });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscriptionStatus: 'past_due',
        });
        console.log(`Payment failed for user ${users[0].id}`);
      }
    }

  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return Response.json({ received: true });
});