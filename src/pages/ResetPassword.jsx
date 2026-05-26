import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '@/api/auth';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { AuthShell, fieldClass, labelClass } from '@/components/AuthShell';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setRecoveryReady(true);
    };

    const hash = window.location.hash?.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const err = params.get('error_description') || params.get('error');
      if (err) {
        setError(decodeURIComponent(err.replace(/\+/g, ' ')));
      }
      if (params.get('type') === 'recovery' || params.get('access_token')) {
        markReady();
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        markReady();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token'))) {
        markReady();
      }
      if (!cancelled) setChecking(false);
    });

    const timeout = setTimeout(() => {
      if (!cancelled) setChecking(false);
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      await checkUserAuth();
      navigate('/dashboard', { replace: true, state: { message: 'Your password has been updated.' } });
    } catch (err) {
      setError(err.message || 'Could not update password. The reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <AuthShell title="Reset your password">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      </AuthShell>
    );
  }

  if (!recoveryReady) {
    return (
      <AuthShell
        title="Reset link invalid or expired"
        subtitle="Request a new password reset email to continue."
        footer={
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-green-700 font-semibold hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2.5 mb-4" role="alert">
            {error}
          </p>
        )}
        <Button asChild className="w-full h-12 font-bold text-base rounded-xl">
          <Link to="/forgot-password">Request new reset link</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="password" className={labelClass}>
            New password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className={labelClass}>
            Confirm new password
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
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2.5" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-12 font-bold text-base rounded-xl" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  );
}
