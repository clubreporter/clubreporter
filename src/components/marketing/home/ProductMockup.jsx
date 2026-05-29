import { motion } from 'framer-motion';
import { FileText, Share2, ImageIcon } from 'lucide-react';
import { LOGO_SRC } from '@/components/ClubReporterLogo';
import { MOCKUP } from '@/lib/homeLandingData';

const EVENT_COLOURS = {
  goal: 'text-emerald-400',
  point: 'text-emerald-300',
  card: 'text-yellow-400',
  sub: 'text-blue-400',
  photo: 'text-purple-400',
  ht: 'text-slate-300',
  report: 'text-emerald-400',
};

export default function ProductMockup() {
  return (
    <div className="w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/5 bg-slate-900/90 flex items-center">
          <span className="inline-flex rounded-lg bg-white px-2.5 py-1">
            <img src={LOGO_SRC} alt="ClubReporter.ie" className="h-5 w-auto max-w-[120px] object-contain" />
          </span>
        </div>
        {/* Match header */}
        <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-white/5 bg-slate-900/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live Match</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">{MOCKUP.competition} · {MOCKUP.venue}</p>
        </div>

        {/* Scoreboard */}
        <div className="px-4 sm:px-5 py-4 bg-slate-950/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 text-center min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{MOCKUP.homeTeam}</p>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">{MOCKUP.homeScore}</p>
            </div>
            <span className="text-xs font-bold text-slate-600 shrink-0">vs</span>
            <div className="flex-1 text-center min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{MOCKUP.awayTeam}</p>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">{MOCKUP.awayScore}</p>
            </div>
          </div>
        </div>

        {/* Timeline feed */}
        <div className="px-4 sm:px-5 py-3 space-y-2 max-h-[240px] overflow-hidden">
          {MOCKUP.events.map((ev, i) => (
            <motion.div
              key={`${ev.minute}-${ev.label}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg text-[11px] sm:text-xs ${
                ev.highlight ? 'bg-white/5 border border-white/10' : ''
              }`}
            >
              <span className="font-mono font-bold text-slate-500 shrink-0 w-7">{ev.minute}</span>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold leading-snug ${EVENT_COLOURS[ev.type] || 'text-slate-300'}`}>
                  {ev.label}
                </span>
                {ev.hasThumb && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] text-slate-500">Match photo attached</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="px-4 sm:px-5 pb-4 pt-2 grid grid-cols-2 gap-2 border-t border-white/5">
          <button
            type="button"
            tabIndex={-1}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold text-white bg-[#1a9e6d] hover:brightness-110 transition-all"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            Generate Report
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold text-white bg-slate-700 border border-white/10 hover:bg-slate-600 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Publish Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
