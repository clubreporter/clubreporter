import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { FeatureIcon } from './LandingFeatureIcon';

function FeatureCard({ feature, color, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        type="button"
        className="w-full text-left p-6 sm:p-7 md:cursor-default"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}14` }}
          >
            <FeatureIcon name={feature.icon} color={color} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
            <span className="md:hidden inline-block mt-3 text-xs font-bold" style={{ color }}>
              {expanded ? 'Show less ↑' : 'Show details ↓'}
            </span>
          </div>
        </div>
      </button>

      <div
        className={`px-6 sm:px-7 pb-6 sm:pb-7 transition-all duration-300 ${
          expanded ? 'block' : 'hidden md:block'
        }`}
      >
        <ul className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-gray-50">
          {feature.details.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function LandingFeatures({ features, color, tabKey }) {
  return (
    <section id="features" className="py-16 sm:py-24 scroll-mt-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div key={tabKey} className="animate-in fade-in duration-300">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 text-center">
            Everything you need to cover the match
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            Professional match reporting tools built specifically for Irish sport.
          </p>
          <div className="grid gap-5">
            {features.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} color={color} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
