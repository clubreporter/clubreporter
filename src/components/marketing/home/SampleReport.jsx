import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import ClubReporterLogo from '@/components/ClubReporterLogo';
import { SAMPLE_REPORT } from '@/lib/homeLandingData';

export default function SampleReport() {
  return (
    <section id="sample-report" className="py-16 sm:py-24 scroll-mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-tight">
              {SAMPLE_REPORT.headline}
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{SAMPLE_REPORT.subheadline}</p>

            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Sample timeline</p>
              <ul className="space-y-2.5">
                {SAMPLE_REPORT.timeline.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1a9e6d] shrink-0 mt-0.5" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('sample-report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex font-bold text-white bg-[#0f172a] hover:bg-slate-800 px-7 py-3.5 rounded-xl transition-colors"
            >
              View sample match report
            </button>
          </motion.div>

          <motion.div
            id="sample-report-preview"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg scroll-mt-24"
          >
            <div className="mb-5 pb-4 border-b border-gray-100">
              <ClubReporterLogo className="h-8 w-auto max-w-[170px]" asLink={false} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Verified Club
              </span>
              <span className="text-xs text-gray-400">Barryroe GAA · Cork SFC</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Final match report</p>
            <div className="font-serif text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {SAMPLE_REPORT.reportExcerpt}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
