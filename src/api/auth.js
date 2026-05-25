import { supabase } from '@/lib/supabase';

function profileToUser(profile, authUser) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    profileType: profile?.profile_type ?? null,
    mediaOutletName: profile?.media_outlet_name ?? null,
    mediaVerificationInfo: profile?.media_verification_info ?? null,
    subscriptionPlan: profile?.subscription_plan ?? 'club',
    subscriptionStatus: profile?.subscription_status ?? 'trialing',
    role: profile?.role ?? 'user',
  };
}

export async function fetchCurrentUser() {
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  return profileToUser(profile, authUser);
}

export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = {};
  if (updates.profileType !== undefined) row.profile_type = updates.profileType;
  if (updates.mediaOutletName !== undefined) row.media_outlet_name = updates.mediaOutletName;
  if (updates.mediaVerificationInfo !== undefined) row.media_verification_info = updates.mediaVerificationInfo;
  if (updates.subscriptionPlan !== undefined) row.subscription_plan = updates.subscriptionPlan;
  if (updates.subscriptionStatus !== undefined) row.subscription_status = updates.subscriptionStatus;

  const { error } = await supabase.from('profiles').update(row).eq('id', user.id);
  if (error) throw error;
  return fetchCurrentUser();
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Redirects to Google; session is restored on return via detectSessionInUrl */
export async function signInWithGoogle(redirectPath = '/dashboard') {
  const redirectTo = `${window.location.origin}${redirectPath}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;
  await signOut();
}

export { profileToUser };
