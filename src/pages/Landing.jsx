import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Facebook, Twitter, Instagram } from 'lucide-react';

const GREEN = '#1a6b3c';
const HEADING = '#111827';
const BODY = '#6b7280';
const SECTION_BG = '#f8faf8';

const FEATURES = [
  { emoji: '⏱️', title: 'Live Timeline', desc: 'Record every goal, point, card and incident as it happens.' },
  { emoji: '📰', title: 'AI Match Reports', desc: 'Generate newspaper style reports in seconds.' },
  { emoji: '📸', title: 'Photo Uploads', desc: 'Link photos directly to match moments.' },
  { emoji: '🤝', title: 'Sponsor Integration', desc: 'Add a sponsor to every published report.' },
  { emoji: '🔗', title: 'Public Share Links', desc: 'Every report gets a unique shareable URL.' },
  { emoji: '🔔', title: 'Push Notifications', desc: 'Alert followers of live match events.' },
];

const TESTIMONIALS = [
  {
    quote: 'We used to spend hours writing match reports after the game. ClubReporter does it in minutes.',
    name: 'John Murphy',
    role: 'Barryroe GAA PRO',
  },
  {
    quote: 'The sponsor feature alone pays for the subscription. Our main sponsor loves seeing their logo on every report.',
    name: "Mary O'Sullivan",
    role: 'Castlehaven GAA',
  },
  {
    quote: 'As a local sports journalist covering 5 clubs every weekend this app has changed everything.',
    name: 'Pat Collins',
    role: 'Southern Star',
  },
];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'forever',
    highlight: false,
    features: [
      '4 matches per month',
      'Manual entry',
      'Basic report',
      'Public link',
      'No credit card',
    ],
    cta: 'Sign Up Free',
  },
  {
    id: 'club',
    name: 'Club',
    price: '€4.99',
    period: 'per month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited matches',
      'Photos',
      'Sponsor integration',
      'Saved roster',
      'Push notifications',
    ],
    cta: 'Get Started',
  },
  {
    id: 'county',
    name: 'County',
    price: '€12.99',
    period: 'per month',
    highlight: false,
    features: [
      'Everything in Club',
      'AI reports',
      'Analytics',
      'Multiple admins',
      'Social media push',
    ],
    cta: 'Get Started',
  },
  {
    id: 'presspass',
    name: 'Press Pass',
    price: '€34.99',
    period: 'per month',
    highlight: false,
    features: [
      'Everything in County',
      'Media profile',
      'Unlimited clubs',
      'Verified press badge',
    ],
    cta: 'Get Started',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Create your match',
    desc: 'Enter teams, venue, competition and date.',
  },
  {
    num: '2',
    title: 'Record live events',
    desc: 'Tap to add goals, points, cards and incidents as they happen.',
  },
  {
    num: '3',
    title: 'Publish your report',
    desc: 'Generate and share your report in one tap.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, ease: 'easeOut' },
};

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
        style={{ backgroundColor: GREEN }}
      >
        <span className="font-black text-white text-sm">CR</span>
      </div>
      <div className="leading-tight">
        <span className="font-black text-lg tracking-tight" style={{ color: HEADING }}>
          ClubReporter<span style={{ color: GREEN }}>.ie</span>
        </span>
      </div>
    </Link>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span className="text-sm" style={{ color: BODY }}>
        Loved by club PROs across Ireland
      </span>
    </div>
  );
}

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/pricing') {
      const timer = setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased" style={{ color: BODY }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              className="hidden sm:inline text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: BODY }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden sm:inline text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: BODY }}
            >
              Pricing
            </a>
            <Link
              to="/login"
              className="text-sm font-semibold px-3 py-2 hover:opacity-80 transition-opacity"
              style={{ color: HEADING }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: GREEN }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                style={{ color: GREEN }}
              >
                Report Every Minute
              </p>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.12] tracking-tight mb-5"
                style={{ color: HEADING }}
              >
                Live Match Reports for GAA and Soccer Clubs
              </h1>

              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: BODY }}>
                Track scores, scorers, cards, substitutions, photos and key moments — then turn every match into a clean, shareable report.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 4px 14px rgba(26, 107, 60, 0.35)',
                      '0 4px 24px rgba(26, 107, 60, 0.55)',
                      '0 4px 14px rgba(26, 107, 60, 0.35)',
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-xl"
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto font-bold text-white px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-95"
                    style={{ backgroundColor: GREEN }}
                  >
                    ☘️ Start Free Trial
                  </Link>
                </motion.div>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl text-base border-2 transition-colors hover:bg-gray-50"
                  style={{ color: HEADING, borderColor: '#e5e7eb' }}
                >
                  View Pricing
                </Link>
              </div>

              <p className="text-sm mb-6" style={{ color: BODY }}>
                Join clubs across Ireland — free to start
              </p>

              <StarRating />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/80 border border-gray-100">
                <img
                  src="/images/hurling-hero.jpg"
                  alt="Hurling action on the pitch"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>
                        Live match
                      </span>
                    </div>
                    <p className="text-sm font-bold" style={{ color: HEADING }}>
                      Barryroe 1-09 · Kilbrittain 0-07
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 sm:py-24 scroll-mt-20" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: HEADING }}>
              Everything you need on match day
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-4 block" role="img" aria-hidden="true">{f.emoji}</span>
                <h3 className="font-bold text-lg mb-2" style={{ color: HEADING }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: BODY }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>
              Testimonials
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: HEADING }}>
              Trusted by clubs and journalists
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: BODY }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer>
                  <p className="font-bold text-sm" style={{ color: HEADING }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: BODY }}>{t.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 sm:py-24 scroll-mt-20" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3" style={{ color: HEADING }}>
              Simple plans for every club
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: BODY }}>
              Start free and upgrade when you need more matches, photos and AI reports.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`relative flex flex-col rounded-2xl p-6 bg-white border ${
                  plan.highlight
                    ? 'border-2 shadow-lg'
                    : 'border-gray-100 shadow-sm'
                }`}
                style={plan.highlight ? { borderColor: GREEN } : undefined}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full"
                    style={{ backgroundColor: GREEN }}
                  >
                    {plan.badge}
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BODY }}>
                  {plan.name}
                </p>
                <p className="text-3xl font-black mb-0.5" style={{ color: HEADING }}>
                  {plan.price}
                </p>
                <p className="text-xs mb-5" style={{ color: BODY }}>{plan.period}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: BODY }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full text-center font-bold py-3 rounded-xl text-sm transition-all ${
                    plan.highlight
                      ? 'text-white hover:opacity-90'
                      : 'border-2 hover:bg-gray-50'
                  }`}
                  style={
                    plan.highlight
                      ? { backgroundColor: GREEN }
                      : { color: HEADING, borderColor: '#e5e7eb' }
                  }
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: GREEN }}>
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: HEADING }}>
              Up and running in three steps
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <div
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-md"
                  style={{ backgroundColor: GREEN }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: HEADING }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: BODY }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-14">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 font-bold text-white px-10 py-4 rounded-xl text-base transition-opacity hover:opacity-95 shadow-md"
              style={{ backgroundColor: GREEN }}
            >
              ☘️ Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            <div>
              <Logo className="mb-3" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] mt-3" style={{ color: GREEN }}>
                Report Every Minute
              </p>
              <p className="text-sm mt-3 max-w-xs leading-relaxed" style={{ color: BODY }}>
                Live match reporting for GAA and soccer clubs across Ireland.
              </p>
            </div>

            <div>
              <p className="font-bold text-sm mb-4" style={{ color: HEADING }}>Quick links</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Sign Up', to: '/signup' },
                  { label: 'Log In', to: '/login' },
                  { label: 'Contact', href: 'mailto:hello@clubreporter.ie' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="hover:opacity-80 transition-opacity" style={{ color: BODY }}>
                        {link.label}
                      </Link>
                    ) : link.href.startsWith('#') || link.href.startsWith('mailto:') ? (
                      <a href={link.href} className="hover:opacity-80 transition-opacity" style={{ color: BODY }}>
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.href} className="hover:opacity-80 transition-opacity" style={{ color: BODY }}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-bold text-sm mb-4" style={{ color: HEADING }}>Follow us</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                  { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{ color: HEADING }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: BODY }}>
            <p>© 2026 ClubReporter.ie</p>
            <p className="font-semibold" style={{ color: GREEN }}>Built for Irish sport</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
