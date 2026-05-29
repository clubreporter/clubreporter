import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { entities } from '@/api/entities';
import { TEST_PAGES, TEST_PAGE_COUNT, resolveTestPagePath } from '@/lib/testPages';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';

export default function TestPages() {
  const { user } = useAuth();
  const [sampleIds, setSampleIds] = useState({ matchId: null, publicSlug: null });

  useEffect(() => {
    document.title = 'ClubReporter – All pages';
    entities.Match.list('-created_date', 5).then((rows) => {
      const m = rows[0];
      setSampleIds({
        matchId: m?.id ?? null,
        publicSlug: m?.publicId ?? null,
      });
    });
  }, []);

  const grouped = TEST_PAGES.reduce((acc, page) => {
    if (!acc[page.group]) acc[page.group] = [];
    acc[page.group].push(page);
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Link to={ROUTES.admin} className="text-sm text-muted-foreground hover:underline">
          ← Admin Panel
        </Link>
        <h1 className="text-xl font-black mt-2 flex items-center gap-2">
          <List className="w-5 h-5" /> All pages
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {TEST_PAGE_COUNT} numbered routes for QA. Use the amber bar while browsing to jump between pages.
        </p>
        {user?.email && (
          <p className="text-xs text-muted-foreground mt-2">
            Signed in as <span className="font-semibold text-foreground">{user.email}</span>
          </p>
        )}
      </div>

      {!sampleIds.matchId && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold mb-1">Sample match data</p>
          <p className="text-muted-foreground mb-3">
            Pages 12 and 16–18 need at least one match. Create one from page 15.
          </p>
          <Link to={ROUTES.matchNew}>
            <Button size="sm">Create sample match</Button>
          </Link>
        </div>
      )}

      {Object.entries(grouped).map(([group, pages]) => (
        <section key={group}>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {group}
          </h2>
          <ul className="space-y-2">
            {pages.map((page) => {
              const href = resolveTestPagePath(page, sampleIds);
              const disabled =
                page.dynamic &&
                ((page.path.includes(':id') && !sampleIds.matchId) ||
                  (page.path.includes(':slug') && !sampleIds.publicSlug));

              return (
                <li
                  key={page.num}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-black text-white">
                    {page.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{page.name}</p>
                    <p className="text-xs text-muted-foreground truncate font-mono">{href}</p>
                  </div>
                  {disabled ? (
                    <span className="text-xs text-muted-foreground shrink-0">needs match</span>
                  ) : (
                    <Link
                      to={href}
                      className="text-xs font-bold text-primary shrink-0 hover:underline"
                    >
                      Open →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
