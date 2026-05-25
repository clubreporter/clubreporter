import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLAN_LABELS = { club: 'Club', county: 'County', presspass: 'Press Pass', basic: 'Club', premium: 'County', media: 'Press Pass' };
const PLAN_PRICES = { club: '€4.99/mo', county: '€12.99/mo', presspass: '€34.99/mo', basic: '€4.99/mo', premium: '€12.99/mo', media: '€34.99/mo' };

export function UpgradeModal({ requiredPlan = 'premium', onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-black text-lg">{PLAN_LABELS[requiredPlan]} Feature</h2>
            <p className="text-sm text-muted-foreground mt-1">
              This feature requires a <strong>{PLAN_LABELS[requiredPlan]}</strong>
              {(requiredPlan === 'county' || requiredPlan === 'premium') && <> or <strong>Press Pass</strong></>} membership
              {' '}(from {PLAN_PRICES[requiredPlan]}).
            </p>
          </div>
        </div>
        <Link to="/billing" onClick={onClose}>
          <Button className="w-full font-bold gap-2" size="lg">
            <Zap className="w-4 h-4" /> Upgrade Now
          </Button>
        </Link>
        <button onClick={onClose} className="w-full text-center mt-3 text-sm text-muted-foreground hover:text-foreground">
          Not now
        </button>
      </div>
    </div>
  );
}

/**
 * Wraps children with a dimmed locked overlay when `locked` is true.
 * Tapping opens the upgrade modal.
 */
export function LockedBlock({ locked = true, requiredPlan = 'county', label = 'County Feature', children }) {
  const [showModal, setShowModal] = useState(false);
  if (!locked) return <>{children}</>;
  return (
    <>
      <div className="relative cursor-pointer select-none" onClick={() => setShowModal(true)}>
        <div className="opacity-30 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-card/90 border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-md">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">{label}</span>
          </div>
        </div>
      </div>
      {showModal && <UpgradeModal requiredPlan={requiredPlan} onClose={() => setShowModal(false)} />}
    </>
  );
}

/** A simple inline lock button — use for individual action buttons */
export function LockedButton({ requiredPlan = 'premium', label, children }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="relative w-full cursor-pointer" onClick={() => setShowModal(true)}>
        <div className="opacity-40 pointer-events-none w-full">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-sm font-bold">{label || `${PLAN_LABELS[requiredPlan]} Feature`}</span>
        </div>
      </div>
      {showModal && <UpgradeModal requiredPlan={requiredPlan} onClose={() => setShowModal(false)} />}
    </>
  );
}