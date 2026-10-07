import React, { useState } from 'react';
import { TeacherProfile, SubjectId } from '../types/whiteboard';
import {
  User,
  School,
  GraduationCap,
  Users,
  Download,
  Upload,
  RotateCcw,
  X,
  Check,
  Edit2,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Plus,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onUpdateProfile: (updates: Partial<TeacherProfile>) => void;
  onOpenTeacherSwitcher: () => void;
  onAddNewTeacher: () => void;
  onExportData: () => void;
  onImportBackup: (file: File) => void;
  onResetDevice: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenTeacherSwitcher,
  onAddNewTeacher,
  onExportData,
  onImportBackup,
  onResetDevice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [school, setSchool] = useState(profile.school || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveEdit = () => {
    if (name.trim()) {
      onUpdateProfile({ name: name.trim(), school: school.trim() || undefined });
    }
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${profile.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">My Profile & Device</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                  CSB-Builds
                </span>
              </div>
              <p className="text-xs text-slate-400">Saved on this computer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Profile Card */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-900 border border-indigo-500 rounded-lg px-2.5 py-1 text-sm text-white font-bold"
                    />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="School Name"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="text-base font-bold text-white">{profile.name}</h4>
                    <p className="text-xs text-slate-400">{profile.role} {profile.school ? `• ${profile.school}` : ''}</p>
                  </>
                )}
              </div>

              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subjects tags */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-700/60">
              {profile.subjects.map((sub) => (
                <span
                  key={sub}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 capitalize"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Friendly Data Transparency Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-200">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>Your profile is saved on this device</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If you use a different computer or clear your browser data, your local profile will not appear there. You can export a backup below to take your lessons anywhere.
            </p>
          </div>

          {/* Teaching Colleagues / Switch Profile */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Classroom & Colleagues
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenTeacherSwitcher();
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-left flex items-center gap-2.5 transition-all text-xs font-medium text-slate-200"
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Switch Teacher</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onAddNewTeacher();
                }}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-left flex items-center gap-2.5 transition-all text-xs font-medium text-slate-200"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Teacher</span>
              </button>
            </div>
          </div>

          {/* Backup & Portability */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Lesson Portability & Safety
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportData}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-left flex items-center gap-2.5 transition-all text-xs font-medium text-slate-200"
                title="Download backup to USB stick or drive"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <div>
                  <div>Export My Data</div>
                  <div className="text-[10px] text-slate-400 font-normal">Save to USB or drive</div>
                </div>
              </button>
              <label
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-left flex items-center gap-2.5 transition-all text-xs font-medium text-slate-200 cursor-pointer"
                title="Restore backup from file"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <div>
                  <div>Import Backup</div>
                  <div className="text-[10px] text-slate-400 font-normal">Move from another PC</div>
                </div>
                <input type="file" accept=".mywhiteboard,.json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Danger zone: Reset Device */}
          <div className="pt-2 border-t border-slate-800">
            {showResetConfirm ? (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Are you sure you want to reset this device?</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  This will remove the ChalkBoard profile saved on this computer. Your whiteboards can also be affected depending on where they are stored.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowResetConfirm(false);
                      onResetDevice();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset this device</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
