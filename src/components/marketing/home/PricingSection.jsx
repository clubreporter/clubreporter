import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING_PLANS, ACCENT, PAID_TRIAL_NOTE, FREE_PLAN_NOTE } from '@/lib/homeLandingData';
import { PlanCta } from '@/components/marketing/PlanCard';
import { CONTACT_EMAIL, MEDIA_NO_TRIAL_NOTE } from '@/lib/planConfig';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 scroll-mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Simple pricing for clubs, counties and media
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Start small and upgrade when your reporting needs grow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: plan.highlight ? -6 : -4 }}
              className={`relative rounded-2xl p-6 flex flex-col bg-white transition-shadow duration-300 ${
                plan.highlight
                  ? 'border-2 shadow-xl lg:scale-[1.03] z-10'
                  : 'border border-gray-100 shadow-sm hover:shadow-md'
              }`}
              style={plan.highlight ? { borderColor: ACCENT.primary } : undefined}
            >
              {plan.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: plan.id === 'presspass' ? '#c9a84c' : ACCENT.primary }}
                >
                  {plan.badge}
                </span>
              )}

              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{plan.name}</p>
              <p className="text-3xl font-black text-gray-900">
                {plan.price}
                {plan.period?.startsWith('/') && (
                  <span className="text-sm font-normal text-gray-400">{plan.period}</span>
                )}
              </p>
              {!plan.period?.startsWith('/') && (
                <p className="text-xs text-gray-400 mb-1">{plan.period}</p>
              )}
              {plan.altPrice && <p className="text-xs text-gray-500 mb-1">{plan.altPrice}</p>}
              {plan.hasTrial && (
                <p className="text-xs font-semibold text-emerald-600 mb-4">{plan.trialLabel}</p>
              )}
              {!plan.hasTrial && plan.id === 'presspass' && (
                <div className="mb-4 space-y-0.5">
                  <p className="text-xs font-semibold text-amber-700">{MEDIA_NO_TRIAL_NOTE}</p>
                  <p className="text-xs text-gray-500">
                    Please contact us at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-700 underline">
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              )}
              {!plan.hasTrial && plan.id === 'free' && <div className="mb-4" />}

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features
                  .filter((f) => !f.startsWith('Credit card') && !f.startsWith('Contact us'))
                  .map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      {f}
                    </li>
                  ))}
              </ul>

              <PlanCta plan={plan} accent={ACCENT.primary} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 space-y-1 text-sm text-gray-400">
          <p>{PAID_TRIAL_NOTE}</p>
          <p>{FREE_PLAN_NOTE}</p>
        </div>
      </div>
    </section>
  );
}
