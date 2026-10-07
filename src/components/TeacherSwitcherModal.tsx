import React from 'react';
import { TeacherProfile } from '../types/whiteboard';
import { Users, Plus, X, Check, Trash2, ShieldCheck, GraduationCap } from 'lucide-react';

interface TeacherSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: TeacherProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: TeacherProfile) => void;
  onAddNewTeacher: () => void;
  onDeleteProfile: (profileId: string) => void;
}

export const TeacherSwitcherModal: React.FC<TeacherSwitcherModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddNewTeacher,
  onDeleteProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Who&apos;s teaching today?</h3>
              <p className="text-xs text-slate-400">Select teacher profile on this device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile List */}
        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProfile(p);
                  onClose();
                }}
                className={`group p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-800/40 border-slate-750 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${p.avatarColor} text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm`}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white truncate">{p.name}</span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {p.subjects.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' • ')}
                      {p.school ? ` • ${p.school}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {profiles.length > 1 && !isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove profile "${p.name}" from this device?`)) {
                          onDeleteProfile(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove profile from this device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isActive && <Check className="w-4 h-4 text-indigo-400 ml-1" />}
                </div>
              </div>
            );
          })}

          {/* Add Another Teacher Card */}
          <button
            onClick={() => {
              onClose();
              onAddNewTeacher();
            }}
            className="w-full p-3.5 rounded-2xl border border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-800/40 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all font-semibold text-xs"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>+ Add another teacher on this computer</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>All profiles saved locally on this computer • No passwords needed</span>
        </div>
      </div>
    </div>
  );
};
