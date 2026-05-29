import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { BRAND } from '@/lib/brandConfig';
import { ACCENT } from '@/lib/homeLandingData';

/**
 * Shared pricing / plan card — marketing pages and onboarding
 */
export default function PlanCard({
  plan,
  selected = false,
  onSelect,
  accent = ACCENT.primary,
  compact = false,
  showFeatures = true,
  showCta = true,
  disabled = false,
}) {
  const isSelectable = typeof onSelect === 'function';
  const Wrapper = isSelectable ? 'button' : 'div';

  const card = (
    <Wrapper
      type={isSelectable ? 'button' : undefined}
      onClick={isSelectable ? () => onSelect(plan.id) : undefined}
      disabled={isSelectable ? disabled : undefined}
      className={`rounded-2xl p-5 sm:p-6 bg-white flex flex-col text-left w-full transition-all ${
        selected
          ? 'border-2 shadow-md'
          : 'border border-gray-100 shadow-sm hover:shadow-md'
      } ${isSelectable && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      style={
        selected
          ? { borderColor: accent }
          : plan.highlight
            ? { borderColor: accent, borderWidth: 2 }
            : undefined
      }
    >
      {plan.badge && (
        <span
          className="text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full self-start mb-3"
          style={{ backgroundColor: plan.id === 'presspass' ? BRAND.media.color : accent }}
        >
          {plan.badge}
        </span>
      )}

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{plan.name}</p>
      <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
        {plan.price}
        {plan.period?.startsWith('/') && (
          <span className="text-sm font-normal text-gray-400">{plan.period}</span>
        )}
      </p>
      {plan.period && !plan.period.startsWith('/') && (
        <p className="text-xs text-gray-400">{plan.period}</p>
      )}
      {plan.altPrice && <p className="text-xs text-gray-500 mt-0.5 mb-1">{plan.altPrice}</p>}

      {plan.hasTrial && !compact && (
        <p className="text-xs font-semibold text-emerald-600 mb-2">{plan.trialLabel}</p>
      )}
      {!plan.hasTrial && plan.id === 'presspass' && !compact && (
        <div className="mb-2 space-y-0.5">
          <p className="text-xs font-semibold text-amber-700">No trial available for Media accounts.</p>
          <p className="text-xs text-gray-500">
            Please contact us at{' '}
            <a href={`mailto:${plan.contactEmail || 'info@clubreporter.ie'}`} className="text-amber-700 underline">
              info@clubreporter.ie
            </a>
          </p>
        </div>
      )}

      {showFeatures && (
        <ul className={`space-y-2 flex-1 ${compact ? 'mt-3 mb-0' : 'mt-2 mb-4'}`}>
          {plan.features
            .filter((f) => !f.startsWith('Credit card') && !f.startsWith('Contact us'))
            .map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
                {f}
              </li>
            ))}
        </ul>
      )}

      {showCta && !isSelectable && <PlanCta plan={plan} accent={accent} />}
    </Wrapper>
  );

  return card;
}

export function PlanCta({ plan, accent = ACCENT.primary, className = '' }) {
  const baseClass = `block w-full text-center font-bold py-3 rounded-xl text-sm transition-opacity hover:opacity-90 ${className}`;

  if (plan.ctaAction === 'contact') {
    return (
      <a
        href={plan.ctaLink}
        className={`${baseClass} text-white`}
        style={{ backgroundColor: BRAND.media.color }}
      >
        {plan.cta}
      </a>
    );
  }

  const isPrimary = plan.highlight || plan.ctaAction === 'trial';
  return (
    <Link
      to={plan.ctaLink}
      className={`${baseClass} ${
        isPrimary ? 'text-white' : 'border-2 border-gray-200 text-gray-900 hover:bg-gray-50'
      }`}
      style={isPrimary ? { backgroundColor: accent } : undefined}
    >
      {plan.cta}
    </Link>
  );
}
