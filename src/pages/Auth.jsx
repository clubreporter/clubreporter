import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '@/api/auth';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function OrDivider() {
  return (
    <div className="relative flex items-center py-1">
      <div className="flex-grow border-t border-gray-200" />
      <span className="mx-4 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
        or
      </span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
  );
}

const fieldClass =
  'mt-1.5 h-11 text-base text-gray-900 bg-white placeholder:text-gray-400 border-gray-200 focus-visible:ring-green-600';

const labelClass = 'text-sm font-semibold text-gray-800';

export default function Auth() {
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth, checkUserAuth } = useAuth();

  const redirectParam = searchParams.get('redirect');
  const sportParam = searchParams.get('sport');
  const accountParam = searchParams.get('account');
  const redirect =
    redirectParam && redirectParam.startsWith('/') && !['/login', '/signup'].includes(redirectParam)
      ? redirectParam
      : '/dashboard';

  const onboardingUrl = () => {
    const params = new URLSearchParams();
    if (accountParam) params.set('account', accountParam);
    if (sportParam) params.set('sport', sportParam);
    const qs = params.toString();
    return qs ? `/onboarding?${qs}` : '/onboarding';
  };

  const signupQuerySuffix = () => {
    const params = new URLSearchParams();
    if (accountParam) params.set('account', accountParam);
    if (sportParam) params.set('sport', sportParam);
    if (redirect !== '/dashboard') params.set('redirect', redirect);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash?.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const err = params.get('error_description') || params.get('error');
      if (err) setError(decodeURIComponent(err.replace(/\+/g, ' ')));
    }
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, redirect]);

  const afterAuth = async () => {
    const user = await checkUserAuth();
    if (user && (!user.profileType || (user.profileType === 'club' && !user.primarySport))) {
      navigate(onboardingUrl(), { replace: true });
    } else {
      navigate(redirect, { replace: true });
    }
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle(redirect);
    } catch (err) {
      setError(err.message || 'Could not sign in with Google.');
      setGoogleLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        const { session } = await signUp(email.trim(), password);
        if (!session) {
          setMessage('Check your email to confirm your account, then sign in.');
          setLoading(false);
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }
      await afterAuth();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || googleLoading;

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8f2f0]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#e8f2f0] to-white flex flex-col">
      <nav className="px-4 py-3 sm:py-4 border-b border-gray-100 bg-white/95 safe-top">
        <Link to="/" className="flex items-center gap-2 w-fit min-h-[44px]">
          <span className="font-black text-gray-900 text-lg">
            ClubReporter<span className="text-[#1A9E6D]">.ie</span>
          </span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isSignUp
              ? 'Start your 14-day free trial — no credit card required.'
              : 'Sign in to your Clubhouse.'}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-colors disabled:opacity-60 disabled:pointer-events-none"
          >
            <GoogleIcon className="w-5 h-5 shrink-0" />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <OrDivider />

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email" className={labelClass}>
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                disabled={busy}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={labelClass}>
                  Password
                </Label>
                {!isSignUp && (
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-700 font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={6}
                placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                disabled={busy}
              />
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword" className={labelClass}>
                  Confirm password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClass}
                  disabled={busy}
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2.5" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2.5" role="status">
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 font-bold text-base rounded-xl"
              disabled={busy}
            >
              {loading ? 'Please wait…' : isSignUp ? 'Sign up with email' : 'Sign in with email'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link
                  to={`/login${signupQuerySuffix()}`}
                  className="text-green-700 font-semibold hover:underline min-h-[44px] inline-flex items-center"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to ClubReporter?{' '}
                <Link
                  to={`/signup${signupQuerySuffix()}`}
                  className="text-green-700 font-semibold hover:underline min-h-[44px] inline-flex items-center"
                >
                  Create account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
