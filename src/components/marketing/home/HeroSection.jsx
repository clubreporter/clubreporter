import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductMockup from './ProductMockup';
import ClubReporterLogo from '@/components/ClubReporterLogo';
import { HERO, scrollTo } from '@/lib/homeLandingData';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(26,158,109,0.12)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(26,107,60,0.08)_0%,_transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <ClubReporterLogo
              className="h-10 sm:h-11 w-auto max-w-[220px]"
              onDark
            />
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.12] tracking-tight mb-5 mt-6 text-white">
              {HERO.headline}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              {HERO.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Link
                to={HERO.primaryLink}
                className="inline-flex items-center justify-center gap-2 font-bold text-[#0f172a] bg-emerald-400 hover:bg-emerald-300 px-7 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/20"
              >
                {HERO.primaryCta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => scrollTo(HERO.secondaryAction)}
                className="inline-flex items-center justify-center font-bold text-white px-7 py-4 rounded-xl border-2 border-white/20 hover:bg-white/5 transition-all"
              >
                {HERO.secondaryCta}
              </button>
            </div>

            <p className="text-sm text-slate-400">{HERO.trustLine}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            aria-hidden="true"
          >
            <ProductMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
