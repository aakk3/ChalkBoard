import React from 'react';
import { BoardFile } from '../types/whiteboard';
import { Sparkles, ArrowRight, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface RecoveryModalProps {
  isOpen: boolean;
  recoveredBoard: BoardFile;
  onOpenRecovered: () => void;
  onStartFresh: () => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({
  isOpen,
  recoveredBoard,
  onOpenRecovered,
  onStartFresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1.5">
          Good news — we recovered your last whiteboard!
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          It looks like your browser closed unexpectedly. We automatically saved your active drawings and lesson notes so you won&apos;t lose your work.
        </p>

        <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl mb-6">
          <div className="text-xs font-bold text-white truncate">{recoveredBoard.title}</div>
          <div className="text-[11px] text-slate-400">
            {recoveredBoard.subjectId.toUpperCase()} • {recoveredBoard.elements.length} strokes • {recoveredBoard.stickyNotes.length} notes
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onStartFresh}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Start Fresh
          </button>
          <button
            onClick={onOpenRecovered}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Open Recovered</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
