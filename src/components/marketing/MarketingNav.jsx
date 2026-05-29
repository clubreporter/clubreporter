import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { scrollTo } from '@/lib/homeLandingData';

const HOME_LINKS = [
  { label: 'Features', action: () => scrollTo('features') },
  { label: 'Sample', action: () => scrollTo('sample-report') },
  { label: 'Pricing', action: () => scrollTo('pricing') },
];

const PAGE_LINKS = [
  { label: 'GAA', to: '/gaelicreporter' },
  { label: 'Soccer', to: '/pitchreporter' },
  { label: 'Rugby', to: '/rugbyreporter' },
  { label: 'Press Pass', to: '/press-pass' },
  { label: 'Pricing', to: '/pricing' },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const links = isHome ? HOME_LINKS : PAGE_LINKS;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#1a9e6d]">
            CR
          </div>
          <span className="font-black text-lg text-gray-900">
            ClubReporter<span className="text-[#1a9e6d]">.ie</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-semibold transition-colors hover:text-gray-900 ${
                  location.pathname === link.to ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={link.action}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline text-sm font-semibold text-gray-700 px-3 py-2 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            to="/onboarding"
            className="text-sm font-bold text-white px-4 py-2.5 rounded-xl bg-[#1a9e6d] hover:bg-[#15803d] transition-colors"
          >
            Start your first match report
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {links.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-semibold text-gray-700 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={() => { link.action(); setOpen(false); }}
                className="block w-full text-left py-3 text-sm font-semibold text-gray-700 border-b border-gray-50"
              >
                {link.label}
              </button>
            )
          )}
          <Link to="/login" onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold text-gray-700">
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}
