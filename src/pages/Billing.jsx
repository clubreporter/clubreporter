import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionStatus, getBillingPortalUrl } from '@/api/billing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PLAN_NAMES = { club: 'Club', county: 'County', presspass: 'Press Pass', basic: 'Club', premium: 'County', media: 'Press Pass' };
const BILLING_NAMES = { month: 'Monthly', year: 'Annual' };

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-800',
    past_due: 'bg-red-100 text-red-700',
    canceled: 'bg-gray-100 text-gray-600',
    none: 'bg-gray-100 text-gray-500',
  };
  const labels = { active: 'Active', past_due: 'Payment Due', canceled: 'Canceled', none: 'No Plan' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status] || map.none}`}>
      {labels[status] || 'Unknown'}
    </span>
  );
}

export default function Billing() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success') === '1';
  const canceled = urlParams.get('cancel') === '1';

  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const inIframe = () => {
    try { return window.self !== window.top; } catch { return true; }
  };

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSub)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openPortal = async () => {
    if (inIframe()) {
      alert('The billing portal only works from the published app URL.');
      return;
    }
    setPortalLoading(true);
    const res = await getBillingPortalUrl();
    if (res?.url) window.location.href = res.url;
    setPortalLoading(false);
  };

  const goToCheckout = (plan) => {
    navigate(`/onboarding?plan=${plan}`);
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
    </div>
  );

  const isActive = sub?.status === 'active';
  const isPastDue = sub?.status === 'past_due';
  const hasSub = isActive || isPastDue;

  return (
    <div className="max-w-lg mx-auto space-y-5 py-4">
      <h2 className="text-xl font-black text-gray-900">Billing</h2>

      {/* Success / cancel banners */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-green-800">Payment successful!</p>
            <p className="text-sm text-green-700">Your subscription is now active.</p>
          </div>
        </div>
      )}
      {canceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-bold text-yellow-800">Checkout canceled.</p>
          <p className="text-sm text-yellow-700">Your plan hasn't changed.</p>
        </div>
      )}
      {isPastDue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-800">Payment required to continue using ClubReporter.</p>
          <p className="text-sm text-red-700 mt-1">Update your payment method to restore full access.</p>
          <Button onClick={openPortal} disabled={portalLoading} className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm h-9">
            {portalLoading ? 'Loading…' : 'Update Payment Method'}
          </Button>
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Current Plan</p>
        {hasSub ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-gray-900">{PLAN_NAMES[sub.plan] || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{BILLING_NAMES[sub.billing] || ''} billing</p>
              </div>
              <StatusBadge status={sub.status} />
            </div>
            {sub.currentPeriodEnd && (
              <p className="text-xs text-gray-400">
                {sub.cancelAtPeriodEnd ? 'Cancels' : 'Renews'} on {new Date(sub.currentPeriodEnd * 1000).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm mb-4">You don't have an active subscription.</p>
            <Button onClick={() => navigate('/onboarding')} className="w-full bg-green-700 hover:bg-green-800 font-bold h-11">
              Choose a Plan →
            </Button>
          </div>
        )}
      </div>

      {/* Plan management */}
      {hasSub && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Manage Plan</p>

          {(sub.plan === 'club' || sub.plan === 'basic') && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900 text-sm">Upgrade to County</p>
                <p className="text-xs text-gray-500">Unlimited matches, AI reports &amp; more</p>
              </div>
              <Button size="sm" className="bg-green-700 hover:bg-green-800 text-sm shrink-0" onClick={() => goToCheckout('county')}>
                Upgrade
              </Button>
            </div>
          )}

          {(sub.plan === 'county' || sub.plan === 'premium') && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900 text-sm">Downgrade to Club</p>
                <p className="text-xs text-gray-500">€4.99/month · 6 matches per month</p>
              </div>
              <Button size="sm" variant="outline" className="text-sm shrink-0" onClick={openPortal}>
                {portalLoading ? 'Loading…' : 'Manage'}
              </Button>
            </div>
          )}

          <Button onClick={openPortal} disabled={portalLoading} variant="outline" className="w-full h-11 font-semibold">
            {portalLoading ? 'Loading…' : 'Open Billing Portal'}
          </Button>
          <p className="text-xs text-gray-400 text-center">Update payment method, cancel, or download invoices</p>
        </div>
      )}

      {/* Invoices */}
      {sub?.invoices?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Invoices</p>
          <div className="divide-y divide-gray-50 -mx-2">
            {sub.invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-2 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(inv.date * 1000).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{inv.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-gray-900">€{(inv.amount / 100).toFixed(2)}</p>
                  {inv.pdf && (
                    <a href={inv.pdf} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-green-700 font-bold hover:underline">PDF</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}