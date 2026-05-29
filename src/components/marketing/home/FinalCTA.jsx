import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ClubReporterLogo from '@/components/ClubReporterLogo';
import { FINAL_CTA, scrollTo } from '@/lib/homeLandingData';

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 bg-[#0f172a] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <ClubReporterLogo className="h-10 w-auto max-w-[200px]" onDark asLink={false} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
            {FINAL_CTA.headline}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            {FINAL_CTA.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center gap-2 font-bold text-[#0f172a] bg-emerald-400 hover:bg-emerald-300 px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
            >
              {FINAL_CTA.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => scrollTo('sample-report')}
              className="inline-flex items-center justify-center font-bold text-white border-2 border-white/20 hover:bg-white/5 px-8 py-4 rounded-xl transition-colors"
            >
              {FINAL_CTA.secondaryCta}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
