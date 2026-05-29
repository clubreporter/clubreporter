import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminAnalytics,
  fetchAdminUsers,
  fetchAdminClubs,
  fetchAdminPublishedReports,
  adminSetUserSubscription,
  adminSuspendUser,
  adminSendPlatformEmail,
  listPendingClubVerifications,
  adminApproveClub,
  adminRejectClub,
  adminCreateClubInvite,
  SUBSCRIPTION_PLAN_OPTIONS,
  SUBSCRIPTION_STATUS_OPTIONS,
} from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  BarChart3,
  Building2,
  Copy,
  Check,
  FileText,
  Mail,
  ShieldCheck,
  Users,
  CreditCard,
  List,
} from 'lucide-react';
import { ROUTES, publicReportPath } from '@/lib/routes';

const TABS = [
  { id: 'overview', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'clubs', label: 'Clubs', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'verify', label: 'Verify', icon: ShieldCheck },
  { id: 'email', label: 'Email', icon: Mail },
];

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-black tabular-nums mt-1">{value ?? '—'}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [reports, setReports] = useState([]);
  const [pending, setPending] = useState([]);
  const [inviteClubName, setInviteClubName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [createdInvite, setCreatedInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [stats, userRows, clubRows, reportRows, pendingRows] = await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminUsers(),
        fetchAdminClubs(),
        fetchAdminPublishedReports(),
        listPendingClubVerifications(),
      ]);
      setAnalytics(stats);
      setUsers(userRows || []);
      setClubs(clubRows || []);
      setReports(reportRows || []);
      setPending(pendingRows || []);
    } catch (e) {
      const msg = e.message || 'Failed to load admin data';
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'ClubReporter – Admin Panel';
    loadAll();
  }, [loadAll]);

  const changePlan = async (userId, plan, status) => {
    setBusyId(userId);
    try {
      await adminSetUserSubscription(userId, plan, status);
      toast.success('Subscription updated');
      loadAll();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId('');
    }
  };

  const toggleSuspend = async (userId, currentlySuspended) => {
    setBusyId(userId);
    try {
      await adminSuspendUser(userId, !currentlySuspended);
      toast.success(currentlySuspended ? 'Account reactivated' : 'Account suspended');
      loadAll();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId('');
    }
  };

  const verifyClub = async (clubId) => {
    setBusyId(clubId);
    try {
      await adminApproveClub(clubId);
      toast.success('Club verified');
      loadAll();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId('');
    }
  };

  const rejectClub = async (clubId) => {
    const reason = window.prompt('Reason for declining (optional):') || '';
    setBusyId(clubId);
    try {
      await adminRejectClub(clubId, reason);
      toast.success('Verification declined');
      loadAll();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId('');
    }
  };

  const createInvite = async () => {
    try {
      const invite = await adminCreateClubInvite({
        clubName: inviteClubName.trim() || null,
        email: inviteEmail.trim() || null,
      });
      setCreatedInvite(invite);
      toast.success('Invite link created');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const copyInvite = async () => {
    if (!createdInvite?.inviteUrl) return;
    await navigator.clipboard.writeText(createdInvite.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setEmailSending(true);
    try {
      await adminSendPlatformEmail({
        to: emailTo.trim(),
        subject: emailSubject.trim(),
        body: emailBody.trim(),
      });
      toast.success('Platform email queued for delivery');
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <div>
        <Link to={ROUTES.dashboard} className="text-sm text-muted-foreground hover:underline">
          ← Clubhouse
        </Link>
        <h1 className="text-xl font-black mt-2">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Platform-wide management and analytics</p>
        <Link to="/test-pages" className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-primary hover:underline">
          <List className="w-4 h-4" />
          View all pages (numbered index) →
        </Link>
      </div>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 space-y-2">
          <p className="font-bold">Admin data could not be loaded</p>
          <p className="text-xs">{loadError}</p>
          <p className="text-xs">
            Run the <strong>Platform admin</strong> section at the bottom of{' '}
            <code className="bg-white px-1 rounded">supabase/schema.sql</code>, then{' '}
            <code className="bg-white px-1 rounded">supabase/seed-admin-brian.sql</code> for your account.
          </p>
          <Button size="sm" variant="outline" onClick={loadAll}>Retry</Button>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
              tab === id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!loading && tab === 'overview' && analytics && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total users" value={analytics.totalUsers} />
          <StatCard label="Suspended" value={analytics.suspendedUsers} />
          <StatCard label="Total clubs" value={analytics.totalClubs} />
          <StatCard label="Verified clubs" value={analytics.verifiedClubs} />
          <StatCard label="Pending verify" value={analytics.pendingVerifications} />
          <StatCard label="Total matches" value={analytics.totalMatches} />
          <StatCard label="Published reports" value={analytics.publishedReports} />
          <StatCard label="Live now" value={analytics.liveMatches} />
          <StatCard label="Free plan" value={analytics.planFree} />
          <StatCard label="Club plan" value={analytics.planClub} />
          <StatCard label="County plan" value={analytics.planCounty} />
          <StatCard label="Media plan" value={analytics.planMedia} />
          <StatCard label="Trialing" value={analytics.trialing} />
          <StatCard label="Active paid" value={analytics.activePaid} />
        </div>
      )}

      {!loading && tab === 'users' && (
        <div className="space-y-3">
          {users.length === 0 && <p className="text-sm text-muted-foreground">No users yet.</p>}
          {users.map((u) => (
            <div key={u.id} className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{u.email || u.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.profile_type || '—'} · {u.primary_sport || '—'} · {u.match_count ?? 0} matches
                    {u.club_name ? ` · ${u.club_name}` : ''}
                  </p>
                </div>
                {u.account_suspended && (
                  <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-1 rounded">
                    Suspended
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  className="text-xs border rounded-lg px-2 py-1.5 bg-background"
                  defaultValue={u.subscription_plan || 'free'}
                  disabled={busyId === u.id}
                  onChange={(e) => changePlan(u.id, e.target.value, u.subscription_status || 'active')}
                >
                  {SUBSCRIPTION_PLAN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <select
                  className="text-xs border rounded-lg px-2 py-1.5 bg-background"
                  defaultValue={u.subscription_status || 'active'}
                  disabled={busyId === u.id}
                  onChange={(e) => changePlan(u.id, u.subscription_plan || 'free', e.target.value)}
                >
                  {SUBSCRIPTION_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant={u.account_suspended ? 'default' : 'destructive'}
                  disabled={busyId === u.id}
                  onClick={() => toggleSuspend(u.id, u.account_suspended)}
                >
                  {u.account_suspended ? 'Reactivate' : 'Suspend'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'clubs' && (
        <div className="space-y-3">
          {clubs.length === 0 && <p className="text-sm text-muted-foreground">No clubs yet.</p>}
          {clubs.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{c.name}{c.county ? ` · ${c.county}` : ''}</p>
                  <p className="text-xs text-muted-foreground">{c.owner_email} · plan: {c.owner_plan || '—'}</p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded">
                  {c.verification_status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {c.ground && <p>Ground: {c.ground}</p>}
                {c.contact_email && <p>Contact: {c.contact_email}</p>}
                {c.website && <p>Web: {c.website}</p>}
              </div>
              {c.verification_status !== 'approved' && (
                <div className="flex gap-2 pt-1">
                  <Button size="sm" disabled={busyId === c.id} onClick={() => verifyClub(c.id)}>
                    Verify club
                  </Button>
                  {c.verification_status === 'pending' && (
                    <Button size="sm" variant="outline" disabled={busyId === c.id} onClick={() => rejectClub(c.id)}>
                      Decline
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 && <p className="text-sm text-muted-foreground">No published reports yet.</p>}
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-4">
              <p className="font-bold">{r.home_team_name} vs {r.away_team_name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {r.sport} · {r.status} · {r.publisher_email}
                {r.club_name ? ` · ${r.club_name}` : ''}
              </p>
              {r.public_id && (
                <a
                  href={publicReportPath(r.public_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-semibold hover:underline mt-2 inline-block"
                >
                  View public report →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'billing' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Change plans from the Users tab. Summary of subscription distribution:
          </p>
          {analytics && (
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Free" value={analytics.planFree} />
              <StatCard label="Club" value={analytics.planClub} />
              <StatCard label="County" value={analytics.planCounty} />
              <StatCard label="Media" value={analytics.planMedia} />
              <StatCard label="Trialing" value={analytics.trialing} />
              <StatCard label="Active paid" value={analytics.activePaid} />
            </div>
          )}
          <ul className="space-y-2">
            {users.filter((u) => u.subscription_plan && u.subscription_plan !== 'free').map((u) => (
              <li key={u.id} className="text-sm rounded-lg border px-3 py-2 flex justify-between gap-2">
                <span className="truncate">{u.email}</span>
                <span className="font-semibold shrink-0">{u.subscription_plan} · {u.subscription_status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && tab === 'verify' && (
        <div className="space-y-6">
          <section className="bg-card border rounded-2xl p-5 space-y-4">
            <h2 className="font-bold">Create one-time invite link</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input value={inviteClubName} onChange={(e) => setInviteClubName(e.target.value)} placeholder="Club name (optional)" />
              <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Restrict to email (optional)" type="email" />
            </div>
            <Button onClick={createInvite} className="font-bold">Generate invite link</Button>
            {createdInvite && (
              <div className="rounded-lg bg-muted p-3 text-sm break-all flex gap-2 items-start">
                <span className="flex-1">{createdInvite.inviteUrl}</span>
                <button type="button" onClick={copyInvite} className="shrink-0 p-1">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-bold">Pending requests ({pending.length})</h2>
            {pending.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending club verifications.</p>
            )}
            {pending.map((row) => (
              <div key={row.id} className="bg-card border rounded-2xl p-4 space-y-3">
                <div>
                  <p className="font-bold">{row.name}{row.county ? ` · ${row.county}` : ''}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.verification_method === 'proof_upload' ? 'Proof uploaded' : 'Invite link requested'}
                  </p>
                  {row.verification_message && (
                    <p className="text-sm mt-2 text-muted-foreground">{row.verification_message}</p>
                  )}
                  {row.verification_proof_url && (
                    <a href={row.verification_proof_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 underline mt-1 inline-block">
                      View proof →
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={busyId === row.id} onClick={() => verifyClub(row.id)} className="font-bold">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyId === row.id} onClick={() => rejectClub(row.id)}>
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {!loading && tab === 'email' && (
        <form onSubmit={sendEmail} className="bg-card border rounded-2xl p-5 space-y-4">
          <h2 className="font-bold">Send platform email</h2>
          <p className="text-xs text-muted-foreground">
            Messages are queued in the admin log. Connect an email provider (e.g. Resend) to deliver automatically.
          </p>
          <div>
            <label className="text-sm font-semibold">To</label>
            <Input type="email" required value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="user@example.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Subject</label>
            <Input required value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject line" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Message</label>
            <Textarea required rows={6} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Email body…" className="mt-1" />
          </div>
          <Button type="submit" disabled={emailSending} className="font-bold">
            {emailSending ? 'Sending…' : 'Queue email'}
          </Button>
        </form>
      )}
    </div>
  );
}
