import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SPORT_CARDS } from '@/lib/homeLandingData';

export default function SportSelection() {
  return (
    <section id="sports" className="py-16 sm:py-24 scroll-mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {SPORT_CARDS.map((sport, i) => (
            <motion.article
              key={sport.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              style={{ borderTopWidth: 3, borderTopColor: sport.color }}
            >
              <span className="text-3xl mb-4 block" aria-hidden="true">{sport.emoji}</span>
              <h2 className="text-xl font-black text-gray-900 mb-2">{sport.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">{sport.description}</p>
              <Link
                to={sport.signup}
                className="inline-flex items-center justify-center gap-2 w-full font-bold text-white py-3.5 rounded-xl transition-all group-hover:gap-3"
                style={{ backgroundColor: sport.color }}
              >
                {sport.cta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
