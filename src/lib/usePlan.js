import { useAuth } from '@/lib/AuthContext';

export function usePlan() {
  const { user, isLoadingAuth } = useAuth();

  const plan = isLoadingAuth ? undefined : (user?.subscriptionPlan || null);
  const status = user?.subscriptionStatus || null;

  const loaded = plan !== undefined;
  const hasAny = !!plan;
  const isCounty = plan === 'county' || plan === 'premium';
  const isPress = plan === 'presspass' || plan === 'media';
  const isPremium = isCounty || isPress;
  const isMedia = isPress;
  const isPastDue = status === 'past_due';

  return { plan, status, loaded, hasAny, isPremium, isCounty, isPress, isMedia, isPastDue };
}
