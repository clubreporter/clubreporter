import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/ui/button';

import { ONBOARDING_ROUTES } from '@/lib/onboardingConstants';
import { loadOnboardingState } from '@/lib/onboardingStorage';

function onboardingPathAfterAuth(searchParams) {
  const stored = loadOnboardingState();
  if (stored.planId) {
    return ONBOARDING_ROUTES.welcome;
  }
  const qsSport = searchParams.get('sport');
  const qsAccount = searchParams.get('account');
  if (qsSport || qsAccount) {
    return ONBOARDING_ROUTES.accountType;
  }
  return ONBOARDING_ROUTES.accountType;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkUserAuth } = useAuth();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const completeSignIn = useCallback(async () => {
    const user = await checkUserAuth();
    if (!user) return false;

    setStatus('success');
    const redirect = searchParams.get('redirect');
    const needsOnboarding =
      !user.profileType || (user.profileType !== 'media' && !user.primarySport);

    window.setTimeout(() => {
      if (needsOnboarding) {
        navigate(onboardingPathAfterAuth(searchParams), { replace: true });
      } else if (redirect && redirect.startsWith('/')) {
        navigate(redirect, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }, 1000);

    return true;
  }, [checkUserAuth, navigate, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const hash = window.location.hash?.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const err = params.get('error_description') || params.get('error');
      if (err) {
        setError(decodeURIComponent(err.replace(/\+/g, ' ')));
        setStatus('error');
        return undefined;
      }
    }

    const tryComplete = async () => {
      if (cancelled) return;
      const ok = await completeSignIn();
      if (!ok && !cancelled) {
        setError('We could not verify your email. The link may have expired.');
        setStatus('error');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        tryComplete();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) tryComplete();
      else {
        window.setTimeout(() => {
          if (!cancelled) tryComplete();
        }, 2500);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [completeSignIn]);

  if (status === 'loading') {
    return (
      <AuthShell title="Confirming your email…" subtitle="Please wait while we verify your ClubReporter account.">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      </AuthShell>
    );
  }

  if (status === 'success') {
    return (
      <AuthShell title="Email confirmed" subtitle="Your ClubReporter account is ready. Taking you to the app…">
        <div className="flex justify-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
            ✓
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Could not confirm email" subtitle={error}>
      <div className="space-y-3 mt-2">
        <Button asChild className="w-full h-11 font-bold rounded-xl">
          <Link to="/signup">Try signing up again</Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-11 font-bold rounded-xl">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
