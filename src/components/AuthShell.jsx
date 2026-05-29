import ClubReporterLogo from '@/components/ClubReporterLogo';

const fieldClass =
  'mt-1.5 h-11 text-base text-gray-900 bg-white placeholder:text-gray-400 border-gray-200 focus-visible:ring-green-600';

const labelClass = 'text-sm font-semibold text-gray-800';

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#e8f2f0] to-white flex flex-col">
      <nav className="px-4 py-3 sm:py-4 border-b border-gray-100 bg-white/95 safe-top">
        <ClubReporterLogo className="h-9 w-auto max-w-[180px]" />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

export { fieldClass, labelClass };
