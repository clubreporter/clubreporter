import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { resendConfirmationEmail, fetchOnboardingSession } from '@/api/auth';
import { supabase } from '@/lib/supabase';
import { ONBOARDING_ROUTES } from '@/lib/onboardingConstants';
import { RESEND_SUCCESS_MESSAGE } from '@/lib/authUrls';

const POLL_MS = 3000;

export default function ConfirmEmailScreen() {
  const { state, nextFromConfirmEmail, backFrom } = useOnboardingFlow();
  const [email, setEmail] = useState(state.signupEmail || '');
  const [verified, setVerified] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkStatus = useCallback(async () => {
    const session = await fetchOnboardingSession();
    if (!session) return false;

    if (session.email) setEmail(session.email);
    if (session.emailVerified) {
      setVerified(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const ok = await checkStatus();
      if (ok && !cancelled) {
        window.setTimeout(() => nextFromConfirmEmail(), 600);
      }
    };

    poll();
    const intervalId = window.setInterval(poll, POLL_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        poll();
      }
    });

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      subscription.unsubscribe();
    };
  }, [checkStatus, nextFromConfirmEmail]);

  if (!state.accountType || !state.planId) {
    return <Navigate to={ONBOARDING_ROUTES.plan} replace />;
  }

  const handleResend = async () => {
    if (!email) return;
    setResendBusy(true);
    setError('');
    try {
      await resendConfirmationEmail(email, {
        redirect: ONBOARDING_ROUTES.confirmEmail,
      });
      setMessage(RESEND_SUCCESS_MESSAGE);
    } catch (err) {
      setError(err.message || 'Could not resend email.');
    } finally {
      setResendBusy(false);
    }
  };

  return (
    <OnboardingLayout
      step={5}
      onBack={() => backFrom(ONBOARDING_ROUTES.confirmEmail)}
      footer={
        verified ? (
          <Button
            className="w-full h-12 font-bold bg-[#1A9E6D] hover:bg-[#158f63] text-white"
            onClick={nextFromConfirmEmail}
          >
            Continue
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col justify-center flex-1 min-h-0 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl shrink-0">
          ✉️
        </div>
        <div className="shrink-0">
          <h1 className="text-xl font-black text-gray-900">Confirm your email</h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {verified
              ? 'Your email is confirmed. You are ready to go!'
              : 'We sent a confirmation link to'}
          </p>
          {email && (
            <p className="text-sm font-bold text-gray-900 mt-1 break-all">{email}</p>
          )}
        </div>
        {!verified && (
          <p className="text-xs text-gray-400 shrink-0">
            Checking confirmation status every few seconds…
          </p>
        )}
        {message && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 shrink-0">{message}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 shrink-0">{error}</p>
        )}
        {!verified && email && (
          <Button
            variant="outline"
            className="w-full h-11 font-bold shrink-0"
            disabled={resendBusy}
            onClick={handleResend}
          >
            {resendBusy ? 'Sending…' : 'Resend confirmation email'}
          </Button>
        )}
      </div>
    </OnboardingLayout>
  );
}
