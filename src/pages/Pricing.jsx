import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import { PRICING_TIERS, SPORT_COMPARISON, BRAND } from '@/lib/brandConfig';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      <MarketingNav />

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Simple, transparent pricing</h1>
            <p className="text-gray-500 max-w-xl mx-auto">All plans support GAA, soccer and rugby. Start free — upgrade when you need more.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 bg-white border flex flex-col ${
                  tier.highlight ? 'border-2 shadow-lg' : 'border-gray-100 shadow-sm'
                }`}
                style={tier.highlight ? { borderColor: BRAND.gaa.color } : undefined}
              >
                {tier.badge && (
                  <span className="text-[10px] font-bold uppercase text-white px-3 py-1 rounded-full self-start mb-3" style={{ backgroundColor: BRAND.gaa.color }}>
                    {tier.badge}
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{tier.name}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {tier.price}
                  <span className="text-sm font-normal text-gray-400">{tier.period}</span>
                </p>
                {tier.altPrice && <p className="text-xs text-gray-400 mb-4">or {tier.altPrice}</p>}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: BRAND.gaa.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.ctaLink}
                  className={`block w-full text-center font-bold py-3 rounded-xl text-sm transition-opacity hover:opacity-90 ${
                    tier.highlight ? 'text-white' : 'border-2 border-gray-200 text-gray-900 hover:bg-gray-50'
                  }`}
                  style={tier.highlight ? { backgroundColor: BRAND.gaa.color } : undefined}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Sport comparison table */}
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
