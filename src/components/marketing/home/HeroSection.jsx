import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductMockup from './ProductMockup';
import { scrollTo } from '@/lib/homeLandingData';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(26,158,109,0.15)_0%,_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(30,58,107,0.12)_0%,_transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">
              ClubReporter.ie
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-[1.1] tracking-tight mb-5">
              Create Live Match Timelines, Reports &amp; Social Updates in Minutes
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              ClubReporter helps Gaelic, soccer and rugby clubs record key match moments, build professional match reports, and keep supporters updated from one simple control panel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                type="button"
                onClick={() => scrollTo('sports')}
                className="inline-flex items-center justify-center gap-2 font-bold text-[#0f172a] bg-white px-7 py-4 rounded-xl hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Choose Your Sport
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center font-bold text-white px-7 py-4 rounded-xl border-2 border-emerald-500/60 hover:bg-emerald-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 14-Day Trial
              </Link>
            </div>

            <p className="text-sm text-slate-400">
              Built for clubs, match reporters, PROs and local sports media.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <ProductMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
