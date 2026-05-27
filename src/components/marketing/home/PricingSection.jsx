import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING_PLANS, ACCENT } from '@/lib/homeLandingData';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 scroll-mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Simple Pricing for Clubs, Counties and Media
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
                  style={{ backgroundColor: ACCENT.primary }}
                >
                  {plan.badge}
                </span>
              )}

              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{plan.name}</p>
              <p className="text-3xl font-black text-gray-900">
                {plan.price}
                {plan.period.startsWith('/') && (
                  <span className="text-sm font-normal text-gray-400">{plan.period}</span>
                )}
              </p>
              {!plan.period.startsWith('/') && (
                <p className="text-xs text-gray-400 mb-1">{plan.period}</p>
              )}
              {plan.altPrice && <p className="text-xs text-gray-500 mb-1">{plan.altPrice}</p>}
              {plan.trial && (
                <p className="text-xs font-semibold text-emerald-600 mb-4">{plan.trial}</p>
              )}
              {!plan.trial && <div className="mb-4" />}

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`block text-center font-bold py-3 rounded-xl transition-all hover:scale-[1.02] ${
                  plan.highlight
                    ? 'text-white shadow-md'
                    : 'text-gray-900 border-2 border-gray-200 hover:border-gray-300'
                }`}
                style={plan.highlight ? { backgroundColor: ACCENT.primary } : undefined}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          All paid plans include a 14-day free trial. No credit card required to start on Free.
        </p>
      </div>
    </section>
  );
}
