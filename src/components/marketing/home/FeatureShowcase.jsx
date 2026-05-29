import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FEATURE_BULLETS } from '@/lib/homeLandingData';

const MINI_TIMELINE = [
  { t: "12'", e: 'Goal — O\'Connor' },
  { t: "24'", e: 'Yellow Card — Walsh' },
  { t: "38'", e: 'Sub — Ryan for Kelly' },
  { t: "67'", e: 'Goal — O\'Sullivan' },
];

export default function FeatureShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-[#0f172a] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5">
              From Match Events to Professional Reports
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              ClubReporter removes the hassle from match reporting. Instead of typing notes into messages, spreadsheets or social posts, your club can record every key event in one place and turn it into a structured report.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {FEATURE_BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/onboarding"
              className="inline-flex font-bold text-[#0f172a] bg-emerald-400 hover:bg-emerald-300 px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Reporting Smarter
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Timeline Preview</span>
              <span className="text-xs font-mono text-slate-400">Barryroe 1-08 — 0-06 Kilbrittain</span>
            </div>

            <ul className="space-y-3 mb-6">
              {MINI_TIMELINE.map((row, i) => (
                <motion.li
                  key={row.t}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5"
                >
                  <span className="font-mono text-xs font-bold text-slate-500 w-10">{row.t}</span>
                  <span className="text-sm font-semibold text-white">{row.e}</span>
                </motion.li>
              ))}
            </ul>

            <div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Generated Report</p>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                Barryroe secured a hard-fought victory at Clonakilty, with goals from O&apos;Connor and O&apos;Sullivan proving decisive in a match that swung on key second-half moments...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
