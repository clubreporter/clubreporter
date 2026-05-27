import { useState, useEffect, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingTestimonials({ testimonials, color, tabKey }) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const touchStart = useRef(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    setIndex(0);
  }, [tabKey]);

  useEffect(() => {
    if (count <= 1) return undefined;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, count, tabKey]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStart.current == null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 scroll-mt-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">
          Trusted by clubs across Ireland
        </p>

        <div key={tabKey} className="animate-in fade-in duration-300">
          {/* Mobile carousel */}
          <div
            className="md:hidden relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <blockquote className="rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[200px]">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">&ldquo;{testimonials[index].quote}&rdquo;</p>
              <footer>
                <p className="font-bold text-sm text-gray-900">{testimonials[index].name}</p>
                <p className="text-xs text-gray-500">{testimonials[index].role}</p>
              </footer>
            </blockquote>
            {count > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button type="button" onClick={prev} className="p-2 rounded-full border border-gray-200" aria-label="Previous">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: i === index ? color : '#e5e7eb' }}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button type="button" onClick={next} className="p-2 rounded-full border border-gray-200" aria-label="Next">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop grid */}
          <div className={`hidden md:grid gap-6 ${count >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <p className="font-bold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
