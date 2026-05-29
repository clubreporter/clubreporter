import { supabase } from '@/lib/supabase';
import { fetchCurrentUser, updateProfile, deleteAccount } from '@/api/auth';
import { getSiteUrl } from '@/lib/authUrls';

function checkoutUrls() {
  const base = getSiteUrl();
  return {
    successUrl: `${base}/billing?success=1`,
    cancelUrl: `${base}/onboarding?checkout=cancelled`,
  };
}

/**
 * Start Stripe checkout via Supabase Edge Function, or activate a local trial when Stripe is not configured.
 */
export async function createCheckoutSession({ plan, billing, clubName }) {
  const user = await fetchCurrentUser();
  if (!user) {
    throw new Error('You must be signed in to continue. Please sign in and try again.');
  }

  if (plan === 'free') {
    await updateProfile({ subscriptionPlan: 'free', subscriptionStatus: 'active' });
    return { trialStarted: true };
  }

  if (plan === 'presspass') {
    throw new Error('Press Pass requires activation. Please contact info@clubreporter.ie.');
  }

  const { successUrl, cancelUrl } = checkoutUrls();

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { plan, billing, clubName, successUrl, cancelUrl },
    });

    if (data?.url) return { url: data.url };
    if (data?.trialStarted) return { trialStarted: true };
    if (data?.error) throw new Error(data.error);

    if (error) {
      const msg = error.message || '';
      if (/401|unauthorized/i.test(msg)) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      if (/500|502|503|504/.test(msg)) {
        throw new Error('Checkout is temporarily unavailable. Please try again or skip for now.');
      }
      // Function not deployed or network issue — fall through to local trial
      console.warn('Stripe edge function unavailable:', msg);
    }
  } catch (err) {
    if (
      err.message?.includes('signed in') ||
      err.message?.includes('session has expired') ||
      err.message?.includes('temporarily unavailable') ||
      err.message?.includes('not configured for')
    ) {
      throw err;
    }
    console.warn('Checkout function unavailable:', err.message);
  }

  // No Stripe — save plan and start 14-day trial locally (Club / County only)
  await updateProfile({
    subscriptionPlan: plan || 'club',
    subscriptionStatus: 'trialing',
  });

  return { trialStarted: true };
}

export async function getSubscriptionStatus() {
  const user = await fetchCurrentUser();
  return {
    plan: user?.subscriptionPlan || 'free',
    billing: 'month',
    status: user?.subscriptionStatus || 'active',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    invoices: [],
  };
}

export async function getBillingPortalUrl() {
  try {
    const { data, error } = await supabase.functions.invoke('billing-portal', {
      body: { returnUrl: `${getSiteUrl()}/billing` },
    });
    if (error) throw error;
    if (data?.url) return { url: data.url };
    if (data?.error) return { error: data.error };
  } catch {
    // fall through
  }
  return { error: 'Billing portal is not available yet. Please contact support@clubreporter.ie.' };
}

export { deleteAccount };
