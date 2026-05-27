import { useEffect, useRef, useState } from 'react';

function AnimatedStat({ stat, color, animate }) {
  const [display, setDisplay] = useState(stat.text || '0');

  useEffect(() => {
    if (!animate || stat.value == null) {
      setDisplay(stat.text || `${stat.value?.toLocaleString()}${stat.suffix || ''}`);
      return;
    }

    const target = stat.value;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(target * eased);
      setDisplay(`${current.toLocaleString()}${stat.suffix || ''}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [animate, stat]);

  return (
    <div className="text-center px-3">
      <p className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color }}>
        {display}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-snug">{stat.label}</p>
    </div>
  );
}

export default function LandingStatsBar({ stats, color, tabKey }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [tabKey]);

  return (
    <section ref={ref} className="border-y border-gray-100 bg-gray-50/80">
      <div key={tabKey} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-in fade-in duration-300">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
          {stats.map((stat, i) => (
            <AnimatedStat key={`${tabKey}-${i}`} stat={stat} color={color} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
