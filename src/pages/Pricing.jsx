import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import PlanCard from '@/components/marketing/PlanCard';
import { SPORT_COMPARISON, BRAND } from '@/lib/brandConfig';
import {
  PRICING_TIERS,
  PAID_TRIAL_NOTE,
  FREE_PLAN_NOTE,
  MEDIA_NO_TRIAL_NOTE,
  CONTACT_EMAIL,
} from '@/lib/planConfig';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      <MarketingNav />

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Simple, transparent pricing</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              All plans support GAA, soccer and rugby. Start free — upgrade when you need more.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {PRICING_TIERS.map((tier) => (
              <PlanCard key={tier.id} plan={tier} accent={BRAND.gaa.color} showCta />
            ))}
          </div>

          <div className="text-center space-y-2 mb-16 text-sm text-gray-500">
            <p>{PAID_TRIAL_NOTE}</p>
            <p>{FREE_PLAN_NOTE}</p>
            <p>
              {MEDIA_NO_TRIAL_NOTE} Please contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-green-700 font-semibold hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-black text-gray-900">Feature comparison by sport</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {SPORT_COMPARISON.headers.map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-bold text-gray-900 bg-white">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPORT_COMPARISON.rows.map((row, i) => (
                    <tr key={row[0]} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-semibold text-gray-900' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
