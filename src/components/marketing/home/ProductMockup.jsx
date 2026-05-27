import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { TIMELINE_EVENTS, CONTROL_BUTTONS } from '@/lib/homeLandingData';

export default function ProductMockup() {
  return (
    <div className="w-full">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/90 mb-3 text-center lg:text-left">
        Live Match Reporting Dashboard
      </p>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/95 p-4 sm:p-5 shadow-2xl shadow-black/40">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Timeline panel */}
          <div className="rounded-xl bg-slate-950/60 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Live Match Timeline</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
              </span>
            </div>

            <div className="flex items-center justify-between mb-4 px-2 py-2 rounded-lg bg-slate-900/80">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Home</p>
                <p className="text-lg font-black text-white font-mono">1-08</p>
              </div>
              <span className="text-xs text-slate-500 font-bold">vs</span>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Away</p>
                <p className="text-lg font-black text-white font-mono">0-06</p>
              </div>
            </div>

            <ul className="space-y-2.5 max-h-[220px] overflow-hidden">
              {TIMELINE_EVENTS.map((ev, i) => (
                <motion.li
                  key={ev.minute}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-2 text-[11px] sm:text-xs"
                >
                  <span className="font-mono font-bold text-slate-500 shrink-0 w-8">{ev.minute}</span>
                  <span className={`font-semibold leading-snug ${ev.color}`}>{ev.label}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Control panel */}
          <div className="rounded-xl bg-slate-950/60 border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Reporter Control Panel</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONTROL_BUTTONS.map((btn, i) => (
                <motion.button
                  key={btn.label}
                  type="button"
                  tabIndex={-1}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.03 }}
                  className={`${btn.color} text-white text-[10px] sm:text-[11px] font-bold py-2.5 px-2 rounded-lg shadow-sm hover:brightness-110 transition-all ${btn.wide ? 'col-span-2 sm:col-span-3 py-3' : ''}`}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
