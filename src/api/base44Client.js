import { entities } from '@/api/entities';
import { fetchCurrentUser, updateProfile, signOut } from '@/api/auth';
import { Core } from '@/api/integrations';

/**
 * Compatibility layer — same shape as the old Base44 SDK so pages keep working.
 * Data and auth now run through Supabase.
 */
export const base44 = {
  entities,

  auth: {
    me: fetchCurrentUser,
    updateMe: updateProfile,
    async logout() {
      await signOut();
      window.location.href = '/';
    },
    redirectToLogin(returnUrl) {
      const redirect = encodeURIComponent(returnUrl || window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${redirect}`;
    },
  },

  integrations: { Core },

  functions: {
    async invoke(name, _payload) {
      if (name === 'createCheckoutSession') {
        const { plan } = _payload || {};
        if (plan) {
          await updateProfile({
            subscriptionPlan: plan,
            subscriptionStatus: 'trialing',
          });
        }
        return {
          data: {
            error: 'Stripe checkout is not configured yet. Your 14-day trial is active — continue to the dashboard.',
          },
        };
      }
      if (name === 'getSubscriptionStatus') {
        const user = await fetchCurrentUser();
        return {
          data: {
            plan: user?.subscriptionPlan || 'club',
            billing: 'month',
            status: user?.subscriptionStatus || 'trialing',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            invoices: [],
          },
        };
      }
      if (name === 'getBillingPortalUrl') {
        return { data: { error: 'Stripe billing portal is not configured yet.' } };
      }
      if (name === 'deleteAccount') {
        const { deleteAccount } = await import('@/api/auth');
        await deleteAccount();
        return { data: { ok: true } };
      }
      throw new Error(`Unknown function: ${name}`);
    },
  },
};

export const base44Public = base44;
