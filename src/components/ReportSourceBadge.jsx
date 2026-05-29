import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { resolveReportSource, REPORT_SOURCE } from '@/lib/reportSource';

export default function ReportSourceBadge({ publisher, size = 'md', showLabel = true }) {
  const source = resolveReportSource({
    profileType: publisher?.profileType,
    clubVerificationStatus: publisher?.clubVerificationStatus,
    mediaOutletName: publisher?.mediaOutletName,
  });

  const Icon = source === REPORT_SOURCE.official_club ? ShieldCheck : null;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full ${sizeClass} ${source.className}`}
      >
        {Icon && <ShieldCheck className="w-3 h-3" aria-hidden="true" />}
        {source.badge}
      </span>
      {showLabel && (
        <p className="text-xs text-muted-foreground text-center">{source.label}</p>
      )}
    </div>
  );
}

export function VerificationStatusPill({ status }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
        <ShieldCheck className="w-3.5 h-3.5" /> Verified Club
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
        <Clock className="w-3.5 h-3.5" /> Verification pending
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-red-800">
        <AlertCircle className="w-3.5 h-3.5" /> Verification declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
      Not verified
    </span>
  );
}
