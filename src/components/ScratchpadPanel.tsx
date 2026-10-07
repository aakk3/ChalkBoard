import React, { useState, useEffect } from 'react';
import {
  FileSignature,
  Clock,
  BookOpen,
  CheckSquare,
  Square,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Calculator,
} from 'lucide-react';
import { BoardFile, SubjectConfig } from '../types/whiteboard';

interface ScratchpadPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeBoard: BoardFile;
  onUpdateBoard: (updates: Partial<BoardFile>) => void;
  subjectConfig: SubjectConfig;
  onInsertSymbol: (symbol: string) => void;
}

export const ScratchpadPanel: React.FC<ScratchpadPanelProps> = ({
  isOpen,
  setIsOpen,
  activeBoard,
  onUpdateBoard,
  subjectConfig,
  onInsertSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'objectives' | 'formulae' | 'timer'>('notes');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(300); // default 5 mins
  const [timerRunning, setTimerRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(300);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopySymbol = (sym: string) => {
    onInsertSymbol(sym);
    setCopiedSymbol(sym);
    setTimeout(() => setCopiedSymbol(null), 1500);
  };

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-40 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md transition-all flex items-center gap-2"
          title="Open Lesson Scratchpad & Teaching Aids"
        >
          <FileSignature className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">Teacher Aids</span>
        </button>
      )}

      {/* Main Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-40 w-84 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-100">Teaching Scratchpad</h2>
              <p className="text-[10px] text-slate-400">{subjectConfig.name} • {subjectConfig.code.split('/')[0]}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/40 p-1 text-[11px]">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'notes' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'objectives' ? 'bg-slate-800 text-sky-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus</span>
          </button>
          <button
            onClick={() => setActiveTab('formulae')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'formulae' ? 'bg-slate-800 text-emerald-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Formulae</span>
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'timer' ? 'bg-slate-800 text-rose-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timer</span>
          </button>
        </div>

        {/* Tab 1: Notes & Scratchpad */}
        {activeTab === 'notes' && (
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-300">Live Lesson Scratchpad</span>
              <span className="text-[10px] text-slate-500">Auto-saved to board</span>
            </div>
            <textarea
              value={activeBoard.scratchpadText || ''}
              onChange={(e) => onUpdateBoard({ scratchpadText: e.target.value })}
              placeholder="Jot down quick lesson reminders, formulas, student questions, or next steps..."
              className="flex-1 w-full bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none font-mono leading-relaxed"
            />

            {/* Quick Symbols Palette */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                  Quick Symbols (Click to insert)
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {subjectConfig.quickSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleCopySymbol(sym)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700/60 text-center transition-transform active:scale-95"
                    title={`Insert ${sym}`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
              {copiedSymbol && (
                <div className="text-[10px] text-emerald-400 mt-1 text-center font-medium">
                  Inserted &quot;{copiedSymbol}&quot; onto canvas!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Syllabus & Lesson Objectives */}
        {activeTab === 'objectives' && (
          <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block mb-1">
                Syllabus Code & Specification
              </label>
              <input
                type="text"
                value={activeBoard.syllabusCode || subjectConfig.code}
                onChange={(e) => onUpdateBoard({ syllabusCode: e.target.value })}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block mb-1">
                Lesson Learning Outcomes (WALT / WILF)
              </label>
              <textarea
                value={activeBoard.lessonObjective || ''}
                onChange={(e) => onUpdateBoard({ lessonObjective: e.target.value })}
                placeholder="• By the end of this lesson, students will be able to:&#10;1. State Snell's law equation&#10;2. Calculate critical angle&#10;3. Solve past paper 4 question"
                rows={8}
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300">
              💡 Tip: Write objectives visible during smartboard presentation so students know expectations.
            </div>
          </div>
        )}

        {/* Tab 3: Formulae & Reference Cheat Sheet */}
        {activeTab === 'formulae' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
              {subjectConfig.name} IGCSE Formula Sheet
            </div>
            {subjectConfig.formulae.map((cat, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5">
                <div className="text-xs font-semibold text-emerald-400 mb-1.5">{cat.category}</div>
                <div className="space-y-1.5">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={() => handleCopySymbol(item.formula)}
                      className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 cursor-pointer group transition-colors"
                      title="Click to insert formula text onto canvas"
                    >
                      <div className="text-[11px] text-slate-400 group-hover:text-slate-200 font-medium">
                        {item.name}
                      </div>
                      <div className="text-xs font-mono text-slate-100 font-semibold">{item.formula}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Exam Quiz Timer */}
        {activeTab === 'timer' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Exam Question Countdown
            </div>

            {/* Timer Display */}
            <div
              className={`text-5xl font-mono font-bold tracking-wider py-4 px-6 rounded-2xl border ${
                timerSeconds === 0
                  ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse'
                  : 'text-rose-400 bg-slate-800/80 border-slate-700 shadow-inner'
              }`}
            >
              {formatTime(timerSeconds)}
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-5 w-full">
              {[
                { label: '3m', sec: 180 },
                { label: '5m', sec: 300 },
                { label: '10m', sec: 600 },
                { label: '15m', sec: 900 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(p.sec);
                    setInitialSeconds(p.sec);
                  }}
                  className={`py-1 rounded-lg text-xs font-mono border transition-all ${
                    timerSeconds === p.sec
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-750'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-3 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(initialSeconds);
                }}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 text-center mt-6">
              Perfect for past-paper structured questions or rapid classroom plenary quizzes.
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
