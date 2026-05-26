import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordForEmail } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthShell, fieldClass, labelClass } from '@/components/AuthShell';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPasswordForEmail(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2.5" role="status">
            If an account exists for <strong>{email}</strong>, you will receive a password reset email shortly.
            Check your spam folder if it does not arrive within a few minutes.
          </p>
          <Button asChild variant="outline" className="w-full h-11 font-semibold rounded-xl">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
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
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2.5" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-12 font-bold text-base rounded-xl" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
