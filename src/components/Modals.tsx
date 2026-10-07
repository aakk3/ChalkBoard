import React from 'react';
import { Sparkles, Trash2, Keyboard, X, Plus, Check } from 'lucide-react';
import { SubjectConfig } from '../types/whiteboard';

interface ClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearModal: React.FC<ClearModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-2">Clear Entire Whiteboard?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          This will wipe all active drawings, annotations, and sticky notes on this board. You can still use Undo (Ctrl+Z) if done by accident.
        </p>
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all"
          >
            Clear Whiteboard
          </button>
        </div>
      </div>
    </div>
  );
};

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectConfig: SubjectConfig;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  subjectConfig,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl text-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">IGCSE Teaching Stamps & Diagrams</h3>
              <p className="text-xs text-slate-400">{subjectConfig.name} Curricula Templates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {subjectConfig.templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl.id);
                onClose();
              }}
              className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition-all group flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {tpl.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold shrink-0 ml-4 transition-all">
                Insert
              </button>
            </div>
          ))}

          {subjectConfig.templates.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No preset templates for this subject. Create shapes using the toolbar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'V', desc: 'Select / Move mode' },
    { key: 'P', desc: 'Freehand Pen tool' },
    { key: 'H', desc: 'Highlighter tool' },
    { key: 'E', desc: 'Eraser tool' },
    { key: 'L', desc: 'Straight Line' },
    { key: 'A', desc: 'Vector Arrow' },
    { key: 'R', desc: 'Rectangle tool' },
    { key: 'C', desc: 'Circle / Ellipse tool' },
    { key: 'T', desc: 'Triangle / Text tool' },
    { key: 'X', desc: 'Cartesian Coordinate Axes' },
    { key: 'S', desc: 'Sticky Note' },
    { key: 'K', desc: 'Laser Pointer' },
    { key: 'Space', desc: 'Pan canvas (Hold & Drag)' },
    { key: 'Ctrl + Z', desc: 'Undo stroke' },
    { key: 'Ctrl + Y', desc: 'Redo stroke' },
    { key: '+ / -', desc: 'Zoom In / Out' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl text-slate-200 p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Whiteboard Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <span className="text-slate-400 text-[11px]">{sc.desc}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-indigo-300 font-bold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
