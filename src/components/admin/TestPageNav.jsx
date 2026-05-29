import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, List, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { canUseTestNavigator } from '@/lib/testAdmin';
import {
  TEST_PAGES,
  TEST_PAGE_COUNT,
  findTestPageForPath,
  resolveTestPagePath,
} from '@/lib/testPages';
import { entities } from '@/api/entities';

export default function TestPageNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [sampleIds, setSampleIds] = useState({ matchId: null, publicSlug: null });

  useEffect(() => {
    if (!canUseTestNavigator(user)) return;
    entities.Match.list('-created_date', 1).then((rows) => {
      const m = rows[0];
      setSampleIds({
        matchId: m?.id ?? null,
        publicSlug: m?.publicId ?? null,
      });
    });
  }, [user]);

  if (!canUseTestNavigator(user)) return null;

  const current = findTestPageForPath(location.pathname + location.search, sampleIds);
  const currentNum = current?.num ?? '—';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 shadow-md safe-top">
        <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-between gap-2 text-xs font-semibold">
          <span className="truncate">
            QA · {user.email} · Page {currentNum}/{TEST_PAGE_COUNT}
            {current ? `: ${current.name}` : ''}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/test-pages"
              className="inline-flex items-center gap-1 rounded-md bg-amber-950/15 px-2 py-1 hover:bg-amber-950/25"
            >
              <List className="w-3.5 h-3.5" />
              Index
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md bg-amber-950/15 px-2 py-1 hover:bg-amber-950/25"
            >
              {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Menu
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[99] bg-black/40" onClick={() => setOpen(false)} aria-hidden />
      )}

      {open && (
        <div className="fixed top-12 left-0 right-0 z-[100] max-h-[70vh] overflow-y-auto bg-white border-b border-amber-200 shadow-xl">
          <div className="max-w-lg mx-auto p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-900">All test pages</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {!sampleIds.matchId && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-2 mb-3">
                Create a match to unlock pages 16–18 and a live public report slug for page 12.
              </p>
            )}
            <ul className="space-y-1">
              {TEST_PAGES.map((page) => {
                const href = resolveTestPagePath(page, sampleIds);
                const disabled =
                  page.dynamic &&
                  ((page.path.includes(':id') && !sampleIds.matchId) ||
                    (page.path.includes(':slug') && !sampleIds.publicSlug));
                const active = current?.num === page.num;

                return (
                  <li key={page.num}>
                    {disabled ? (
                      <span className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-400">
                        <span className="w-6 text-center font-black">{page.num}</span>
                        <span>{page.name}</span>
                        <span className="text-[10px] ml-auto">needs data</span>
                      </span>
                    ) : (
                      <Link
                        to={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
                          active
                            ? 'bg-green-100 text-green-900 font-semibold'
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-6 text-center font-black">{page.num}</span>
                        <span className="flex-1">{page.name}</span>
                        <span className="text-[10px] text-gray-400">{page.group}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Spacer so content is not hidden under the QA bar */}
      <div className="h-10" aria-hidden />
    </>
  );
}
