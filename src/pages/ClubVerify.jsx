import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { entities } from '@/api/entities';
import ClubVerificationForm from '@/components/club/ClubVerificationForm';
import { VerificationStatusPill } from '@/components/ReportSourceBadge';
import { ArrowLeft } from 'lucide-react';

export default function ClubVerify() {
  const [searchParams] = useSearchParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'ClubReporter – Verify your club';
    entities.Club.list().then((clubs) => {
      setClub(clubs[0] || null);
      setLoading(false);
    });
  }, []);

  const initialToken = searchParams.get('token') || '';

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Clubhouse
      </Link>

      <div>
        <h1 className="text-xl font-black text-foreground">Club verification</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify {club?.name || 'your club'} to publish <strong>Official Club Reports</strong>.
        </p>
      </div>

      {club && (
        <div className="flex items-center gap-2">
          <VerificationStatusPill status={club.verificationStatus || 'unverified'} />
        </div>
      )}

      {!club && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Create your club profile first</p>
          <p className="mt-1">Add your club name and details before submitting verification.</p>
          <Link to="/club" className="inline-block mt-3 font-semibold text-green-700 underline">
            Go to My Club →
          </Link>
        </div>
      )}

      <ClubVerificationForm
        club={club}
        defaultInviteToken={initialToken}
        onSuccess={(updated) => setClub((c) => ({ ...c, ...updated }))}
      />

      {initialToken && !club?.verificationStatus && (
        <p className="text-xs text-muted-foreground text-center">
          Your invite link code has been detected — choose &quot;I have an invite link&quot; above.
        </p>
      )}
    </div>
  );
}
