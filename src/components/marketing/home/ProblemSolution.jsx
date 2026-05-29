import { motion } from 'framer-motion';
import { PROBLEM_SOLUTION } from '@/lib/homeLandingData';

export default function ProblemSolution() {
  return (
    <section className="py-16 sm:py-22 bg-slate-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 max-w-2xl mx-auto leading-tight">
            {PROBLEM_SOLUTION.headline}
          </h2>
          <p className="text-lg sm:text-xl font-semibold text-[#1a9e6d] mb-12">
            {PROBLEM_SOLUTION.subheadline}
          </p>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {PROBLEM_SOLUTION.benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm"
              >
                <span className="text-2xl mb-3 block" aria-hidden="true">{b.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{b.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
