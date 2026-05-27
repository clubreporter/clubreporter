import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { scrollTo } from '@/lib/homeLandingData';

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
            Ready to Turn Match Updates into Professional Reports?
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8">
            Choose your sport and start creating cleaner timelines, faster reports and better match-day updates with ClubReporter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              type="button"
              onClick={() => scrollTo('sports')}
              className="inline-flex items-center justify-center gap-2 font-bold text-white bg-[#0f172a] px-8 py-4 rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02]"
            >
              Choose Your Sport
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center font-bold text-[#0f172a] bg-emerald-400 hover:bg-emerald-300 px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
            >
              Start 14-Day Trial
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            No complicated setup. Built for real clubs, real matches and busy volunteers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
