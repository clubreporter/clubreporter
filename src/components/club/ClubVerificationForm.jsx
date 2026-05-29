import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link2, Mail } from 'lucide-react';
import {
  submitClubVerification,
  redeemClubInviteToken,
  uploadVerificationProof,
} from '@/api/clubVerification';
import { CONTACT_EMAIL } from '@/lib/planConfig';

export default function ClubVerificationForm({
  club,
  onSuccess,
  onSkip,
  showSkip = false,
  compact = false,
  defaultInviteToken = '',
}) {
  const [method, setMethod] = useState(defaultInviteToken ? 'invite_redeem' : 'proof_upload');
  const [message, setMessage] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [inviteToken, setInviteToken] = useState(defaultInviteToken);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const clubId = club?.id;
  const status = club?.verificationStatus || 'unverified';
  const canSubmit = status === 'unverified' || status === 'rejected';

  const handleSubmit = async () => {
    setError('');
    setBusy(true);
    try {
      if (method === 'invite_redeem') {
        if (!inviteToken.trim()) {
          setError('Please enter your invite link code.');
          return;
        }
        const updated = await redeemClubInviteToken(inviteToken);
        onSuccess?.(updated);
        return;
      }

      if (!clubId) {
        setError('Please save your club profile first.');
        return;
      }

      if (method === 'proof_upload') {
        if (!proofFile) {
          setError('Please upload proof of your club role (email screenshot, letter, etc.).');
          return;
        }
        const proofUrl = await uploadVerificationProof(proofFile);
        const updated = await submitClubVerification({
          clubId,
          method: 'proof_upload',
          proofUrl,
          message,
        });
        onSuccess?.(updated);
        return;
      }

      const updated = await submitClubVerification({
        clubId,
        method: 'invite_link',
        message: message || 'Requested a one-time club invite link.',
      });
      onSuccess?.(updated);
    } catch (e) {
      setError(e.message || 'Could not submit verification. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (status === 'approved') {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Your club is verified.</p>
        <p className="mt-1">Published reports will show as <strong>Official Club Report</strong>.</p>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 space-y-2">
        <p className="font-semibold">Verification request submitted</p>
        <p>We review club applications within 24 hours. You can use ClubReporter while you wait — public reports will show as a club report until verified.</p>
        <p className="text-xs">
          Questions? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${compact ? '' : 'bg-white rounded-2xl border p-5 sm:p-6'}`}>
      {!compact && (
        <>
          <h2 className="text-lg font-bold text-gray-900">Verify your club</h2>
          <p className="text-sm text-gray-500">
            Verified clubs receive a badge and published reports are labelled{' '}
            <strong>Official Club Report</strong>.
          </p>
        </>
      )}

      {status === 'rejected' && club?.rejectionReason && (
        <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2" role="alert">
          Previous request declined: {club.rejectionReason}
        </p>
      )}

      <div className="grid sm:grid-cols-3 gap-2">
        {[
          { id: 'proof_upload', label: 'Upload proof', icon: Upload },
          { id: 'invite_link', label: 'Request invite link', icon: Mail },
          { id: 'invite_redeem', label: 'I have an invite link', icon: Link2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={!canSubmit || busy}
            onClick={() => setMethod(id)}
            className={`rounded-xl border-2 p-3 text-left text-sm transition-colors ${
              method === id ? 'border-green-700 bg-green-50' : 'border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4 mb-1 text-gray-600" />
            <span className="font-semibold text-gray-900">{label}</span>
          </button>
        ))}
      </div>

      {method === 'proof_upload' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Proof of club role
          </label>
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-600 hover:border-green-600">
            <Upload className="w-4 h-4 shrink-0" />
            {proofFile ? proofFile.name : 'Upload screenshot, club email or letter (PDF, JPG, PNG)'}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      )}

      {method === 'invite_link' && (
        <p className="text-sm text-gray-600">
          We will email a one-time invite link to your club contact address. You can also contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-green-700 font-semibold underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      {method === 'invite_redeem' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Invite link code
          </label>
          <Input
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            placeholder="Paste the code from your invite link"
            className="h-11"
            disabled={busy}
          />
        </div>
      )}

      {method !== 'invite_redeem' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
            Note for our team (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="e.g. I am the Barryroe GAA PRO — our club email is pro@barryroe.ie"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            disabled={busy}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || busy}
          className="flex-1 font-bold"
        >
          {busy ? 'Please wait…' : method === 'invite_redeem' ? 'Redeem invite link' : 'Submit verification request'}
        </Button>
        {showSkip && onSkip && (
          <Button type="button" variant="outline" onClick={onSkip} disabled={busy} className="flex-1">
            Verify later
          </Button>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-gray-400 text-center">
          Fan accounts publish <strong>Community Reports</strong>. Only verified clubs receive the official badge.
        </p>
      )}
    </div>
  );
}

export function ClubVerificationBanner({ club, profileType }) {
  if (profileType !== 'club' || !club) return null;
  if (club.verificationStatus === 'approved') return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-amber-950">
          {club.verificationStatus === 'pending'
            ? 'Club verification is under review'
            : 'Verify your club for an official badge'}
        </p>
        <p className="text-xs text-amber-900/80 mt-0.5">
          Official club reports are labelled clearly for supporters.
        </p>
      </div>
      <Button asChild size="sm" variant="outline" className="shrink-0 border-amber-300 bg-white">
        <Link to="/club/verify">Verify club</Link>
      </Button>
    </div>
  );
}
