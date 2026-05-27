import { motion } from 'framer-motion';
import { HOW_IT_WORKS, ACCENT } from '@/lib/homeLandingData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 scroll-mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-12 sm:mb-16 text-center">
          How ClubReporter Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-200 to-transparent" />
              )}
              <div
                className="w-16 h-16 rounded-2xl text-white font-black text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                style={{ backgroundColor: ACCENT.primary }}
              >
                {step.step}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
