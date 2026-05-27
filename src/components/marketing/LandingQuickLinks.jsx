import { QUICK_LINKS } from '@/lib/landingPageData';

export default function LandingQuickLinks({ activeTab, color, onTabChange, onNavigate }) {
  const links = QUICK_LINKS[activeTab] || QUICK_LINKS.all;

  const handleClick = (link) => {
    if (link.tab && link.tab !== activeTab) {
      onTabChange(link.tab);
    }
    setTimeout(() => onNavigate(link.section), link.tab ? 150 : 0);
  };

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleClick(link)}
              className="shrink-0 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-gray-300 transition-colors whitespace-nowrap"
              style={{ '--hover-color': color }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
