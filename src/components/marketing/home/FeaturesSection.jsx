import { motion } from 'framer-motion';
import { Clock, Camera, FileText, Users, Handshake, Share2 } from 'lucide-react';
import { FEATURES } from '@/lib/homeLandingData';

const ICONS = {
  timeline: Clock,
  camera: Camera,
  report: FileText,
  users: Users,
  sponsor: Handshake,
  share: Share2,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 scroll-mt-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-12 text-center">
          Everything you need on match day
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] || Clock;
            return (
              <motion.article
                key={f.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1a9e6d]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-black text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
