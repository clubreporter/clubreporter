import { motion } from 'framer-motion';
import { BENEFITS } from '@/lib/homeLandingData';

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 sm:py-28 scroll-mt-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-12 sm:mb-16 text-center max-w-3xl mx-auto leading-tight">
          Everything You Need to Report a Match Professionally
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-2xl mb-4 block">{b.icon}</span>
              <h3 className="text-lg font-black text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
