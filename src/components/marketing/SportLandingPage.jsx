import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import MarketingNav from './MarketingNav';
import MarketingFooter from './MarketingFooter';
import { PRICING_TIERS } from '@/lib/brandConfig';

/**
 * Shared layout for sport-specific marketing pages
 */
export default function SportLandingPage({
  brand,
  headline,
  subheadline,
  features,
  codes,
  exampleTitle,
  exampleContent,
  showPricing = true,
  pricingHighlight,
  verification,
}) {
  const signupUrl = `/signup${brand.signupQuery || ''}`;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundColor: brand.color }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: brand.color }}>
              {brand.motif} Part of ClubReporter.ie
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5 max-w-3xl">
              {headline}
            </h1>
            {subheadline && (
              <p className="text-lg text-gray-500 max-w-2xl mb-8 leading-relaxed">{subheadline}</p>
            )}
            <Link
              to={signupUrl}
              className="inline-flex items-center gap-2 font-bold text-white px-8 py-4 rounded-xl text-base hover:opacity-95 transition-opacity shadow-lg"
              style={{ backgroundColor: brand.color }}
            >
              {brand.signupLabel}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#f8faf8' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">
            Built for {brand.product}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                {f.emoji && <span className="text-2xl mb-3 block">{f.emoji}</span>}
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          {codes && (
            <p className="text-center text-sm text-gray-500 mt-8">
              <strong className="text-gray-700">Covers:</strong> {codes}
            </p>
          )}
        </div>
      </section>

      {/* Example report */}
      {exampleContent && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">{exampleTitle || 'Example match report'}</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 shadow-sm font-serif text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {exampleContent}
            </div>
          </div>
        </section>
      )}

      {/* Verification (Press Pass) */}
      {verification && (
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl font-black text-gray-900 mb-4">{verification.title}</h2>
            <ul className="text-left space-y-3 mb-6">
              {verification.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brand.color }} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">{verification.note}</p>
          </div>
        </section>
      )}

      {/* Pricing snippet */}
      {showPricing && (
        <section className="py-16 sm:py-20" style={{ backgroundColor: '#f8faf8' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Pricing for {pricingHighlight || brand.product}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-5 bg-white border flex flex-col ${
                    tier.id === (pricingHighlight === 'Press Pass' ? 'presspass' : 'club') && tier.highlight !== false
                      ? 'border-2 shadow-md'
                      : 'border-gray-100'
                  }`}
                  style={
                    tier.id === 'club' && pricingHighlight !== 'Press Pass'
                      ? { borderColor: brand.color }
                      : tier.highlight
                        ? { borderColor: brand.color }
                        : undefined
                  }
                >
                  {tier.badge && (
                    <span className="text-[10px] font-bold uppercase text-white px-2 py-0.5 rounded-full self-start mb-2" style={{ backgroundColor: brand.color }}>
                      {tier.badge}
                    </span>
                  )}
                  <p className="text-xs font-bold uppercase text-gray-400">{tier.name}</p>
                  <p className="text-2xl font-black text-gray-900">{tier.price}<span className="text-sm font-normal text-gray-400">{tier.period}</span></p>
                  <Link
                    to={tier.ctaLink}
                    className="mt-4 block text-center font-bold py-2.5 rounded-xl text-sm text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center mt-6">
              <Link to="/pricing" className="text-sm font-semibold hover:underline" style={{ color: brand.color }}>
                View full pricing comparison →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <Link
          to={signupUrl}
          className="inline-flex font-bold text-white px-10 py-4 rounded-xl text-lg hover:opacity-95 shadow-md"
          style={{ backgroundColor: brand.color }}
        >
          {brand.signupLabel}
        </Link>
      </section>

      <MarketingFooter />
    </div>
  );
}
