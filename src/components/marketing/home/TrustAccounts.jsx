import { motion } from 'framer-motion';
import { ShieldCheck, Users } from 'lucide-react';
import { ACCOUNT_TYPES } from '@/lib/homeLandingData';

const ICONS = { verified: ShieldCheck, fan: Users };

export default function TrustAccounts() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 text-center">
          Verified clubs and community reporters
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          Supporters always know who published the report — official club coverage or community reporting.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {ACCOUNT_TYPES.map((type, i) => {
            const Icon = ICONS[type.id];
            return (
              <motion.article
                key={type.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white border border-gray-100 p-7 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gray-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{type.title}</h3>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${type.badgeStyle}`}>
                      {type.badge}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{type.description}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{type.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
