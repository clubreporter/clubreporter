import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SPORT_CARDS } from '@/lib/homeLandingData';

export default function SportSelection() {
  return (
    <section id="sports" className="py-20 sm:py-28 scroll-mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Choose Your Sport
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            ClubReporter adapts to the way your sport is reported, with the right events, scoring options and match flow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SPORT_CARDS.map((sport, i) => (
            <motion.article
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
              style={{ borderTopWidth: 4, borderTopColor: sport.color }}
            >
              <span className="text-4xl mb-4 block">{sport.emoji}</span>
              <h3 className="text-xl font-black text-gray-900 mb-3">{sport.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-6">{sport.description}</p>
              <Link
                to={sport.signup}
                className="inline-flex items-center justify-center gap-2 w-full font-bold text-white py-3.5 rounded-xl transition-all group-hover:gap-3"
                style={{ backgroundColor: sport.color }}
              >
                {sport.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
