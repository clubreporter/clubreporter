import { supabase } from '@/lib/supabase';
import { buildAuthCallbackUrl, getSiteUrl } from '@/lib/authUrls';

function profileToUser(profile, authUser, emailVerified = true) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    emailVerified,
    profileType: profile?.profile_type ?? null,
    primarySport: profile?.primary_sport ?? null,
    mediaOutletName: profile?.media_outlet_name ?? null,
    mediaVerificationInfo: profile?.media_verification_info ?? null,
    subscriptionPlan: profile?.subscription_plan ?? 'free',
    subscriptionStatus: profile?.subscription_status ?? 'active',
    role: profile?.role ?? 'user',
    isAdmin: Boolean(profile?.is_admin) || profile?.role === 'admin',
    accountSuspended: Boolean(profile?.account_suspended),
  };
}

/** Email/password accounts must confirm; OAuth providers are treated as verified */
export function isEmailVerified(authUser) {
  if (!authUser) return false;
  const provider = authUser.app_metadata?.provider;
  if (provider && provider !== 'email') return true;
  return Boolean(authUser.email_confirmed_at || authUser.confirmed_at);
}

/** No session after signUp — user must confirm via email */
export function isSignupConfirmationPending(data) {
  if (!data?.user || data.session) return false;
  return !isEmailVerified(data.user);
}

/** Supabase returns an empty identities array when the email is already registered */
export function isDuplicateSignup(data) {
  const identities = data?.user?.identities;
  return Array.isArray(identities) && identities.length === 0;
}

export async function fetchCurrentUser(options = {}) {
  const { allowUnverified = false } = options;
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) return null;

  const verified = isEmailVerified(authUser);

  if (!verified && !allowUnverified) {
    await supabase.auth.signOut();
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  return profileToUser(profile, authUser, verified);
}

/** Session check for onboarding email step — never signs out unverified users */
export async function fetchOnboardingSession() {
  const { data: { user: authUser }, error } = await supabase.auth.getUser();
  if (error || !authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    emailVerified: isEmailVerified(authUser),
  };
}

export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const row = {};
  if (updates.profileType !== undefined) row.profile_type = updates.profileType;
  if (updates.primarySport !== undefined) row.primary_sport = updates.primarySport;
  if (updates.mediaOutletName !== undefined) row.media_outlet_name = updates.mediaOutletName;
  if (updates.mediaVerificationInfo !== undefined) row.media_verification_info = updates.mediaVerificationInfo;
  if (updates.subscriptionPlan !== undefined) row.subscription_plan = updates.subscriptionPlan;
  if (updates.subscriptionStatus !== undefined) row.subscription_status = updates.subscriptionStatus;

  const { error } = await supabase.from('profiles').update(row).eq('id', user.id);
  if (error) throw error;
  return fetchCurrentUser();
}

export async function signUp(email, password, options = {}) {
  const emailRedirectTo = buildAuthCallbackUrl({
    sport: options.sport,
    account: options.account,
    plan: options.plan,
    redirect: options.redirect,
  });

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo,
      data: {
        signup_sport: options.sport || null,
        signup_account: options.account || null,
        signup_plan: options.plan || null,
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function resendConfirmationEmail(email, options = {}) {
  const emailRedirectTo = buildAuthCallbackUrl({
    sport: options.sport,
    account: options.account,
    plan: options.plan,
    redirect: options.redirect,
  });

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: { emailRedirectTo },
  });

  if (error) throw error;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      const err = new Error('Please confirm your email before signing in.');
      err.code = 'email_not_confirmed';
      throw err;
    }
    throw error;
  }

  if (data.user && !isEmailVerified(data.user)) {
    await supabase.auth.signOut();
    const err = new Error('Please confirm your email before signing in.');
    err.code = 'email_not_confirmed';
    throw err;
  }

  return data;
}

/** Sends a password reset email; link opens /reset-password */
export async function resetPasswordForEmail(email) {
  const redirectTo = `${getSiteUrl()}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw error;
}

/** Set a new password (user must have arrived via recovery link) */
export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

/** Redirects to Google; session is restored on return via detectSessionInUrl */
export async function signInWithGoogle(redirectPath = '/dashboard') {
  const redirectTo = `${getSiteUrl()}${redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`}`;
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
