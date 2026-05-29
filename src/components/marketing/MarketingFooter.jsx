import { Link } from 'react-router-dom';
import { BRAND } from '@/lib/brandConfig';
import ClubReporterLogo from '@/components/ClubReporterLogo';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="mb-3">
              <ClubReporterLogo className="h-9 w-auto max-w-[180px]" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{BRAND.master.tagline}</p>
          </div>

          <div>
            <p className="font-bold text-sm text-gray-900 mb-4">Sports</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/gaelicreporter" className="hover:text-gray-900">GAA</Link></li>
              <li><Link to="/pitchreporter" className="hover:text-gray-900">Soccer</Link></li>
              <li><Link to="/rugbyreporter" className="hover:text-gray-900">Rugby</Link></li>
              <li><Link to="/press-pass" className="hover:text-gray-900">Press Pass</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-sm text-gray-900 mb-4">Product</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/#features" className="hover:text-gray-900">Features</a></li>
              <li><Link to="/pricing" className="hover:text-gray-900">Pricing</Link></li>
              <li><Link to="/gaelicreporter" className="hover:text-gray-900">Reports example</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-sm text-gray-900 mb-4">Company</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-gray-900">About</Link></li>
              <li><a href="mailto:hello@clubreporter.ie" className="hover:text-gray-900">Contact</a></li>
              <li><Link to="/" className="hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-sm text-gray-900 mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-gray-900">Terms</Link></li>
              <li><Link to="/" className="hover:text-gray-900">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© 2026 ClubReporter.ie</p>
          <p className="font-semibold" style={{ color: BRAND.gaa.color }}>Built for Irish sport</p>
        </div>
      </div>
    </footer>
  );
}
