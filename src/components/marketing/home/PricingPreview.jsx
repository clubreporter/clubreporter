import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRICING_PREVIEW } from '@/lib/homeLandingData';
import { PlanCta } from '@/components/marketing/PlanCard';
import { ACCENT } from '@/lib/homeLandingData';

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-16 sm:py-24 scroll-mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            Plans that grow with your club
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">Start free. Upgrade when you need more coverage.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm flex flex-col"
          >
            <h3 className="text-xl font-black text-gray-900 mb-1">Free</h3>
            <p className="text-2xl font-black text-gray-900 mb-3">€0</p>
            <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
              Forever free — 4 matches per month, manual entry and basic reports.
            </p>
            <Link
              to="/onboarding?plan=free"
              className="block text-center font-bold py-3 rounded-xl border-2 border-gray-200 text-gray-900 hover:bg-gray-50"
            >
              Start Free
            </Link>
          </motion.article>

          {PRICING_PREVIEW.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.07 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-6 bg-white flex flex-col transition-shadow duration-300 ${
                plan.highlight
                  ? 'border-2 border-[#1a9e6d] shadow-lg'
                  : 'border border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.highlight && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a9e6d] mb-2">
                  Best for Clubs
                </span>
              )}
              {plan.id === 'presspass' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2">
                  For Media
                </span>
              )}
              <h3 className="text-xl font-black text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-2xl font-black text-gray-900 mb-1">{plan.price}</p>
              {plan.hasTrial && (
                <p className="text-xs font-semibold text-emerald-600 mb-2">14-day free trial</p>
              )}
              {!plan.hasTrial && plan.id === 'presspass' && (
                <p className="text-xs font-semibold text-amber-700 mb-2">No trial — contact us to activate</p>
              )}
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{plan.description}</p>
              <PlanCta plan={plan} accent={ACCENT.primary} />
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/pricing"
            className="inline-flex font-bold text-[#1a9e6d] border-2 border-[#1a9e6d] hover:bg-emerald-50 px-8 py-3.5 rounded-xl transition-colors"
          >
            Compare all plans
          </Link>
        </div>
      </div>
    </section>
  );
}
