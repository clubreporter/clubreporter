import { fetchCurrentUser, updateProfile, deleteAccount } from '@/api/auth';

export async function getSubscriptionStatus() {
  const user = await fetchCurrentUser();
  return {
    plan: user?.subscriptionPlan || 'club',
    billing: 'month',
    status: user?.subscriptionStatus || 'trialing',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    invoices: [],
  };
}

export async function getBillingPortalUrl() {
  return { error: 'Stripe billing portal is not configured yet.' };
}

export async function createCheckoutSession({ plan }) {
  if (plan) {
    await updateProfile({
      subscriptionPlan: plan,
      subscriptionStatus: 'trialing',
    });
  }
  return {
    error: 'Stripe checkout is not configured yet. Your 14-day trial is active — continue to the dashboard.',
  };
}

export { deleteAccount };
