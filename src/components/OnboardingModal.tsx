import React, { useState } from 'react';
import { SubjectId, TeacherProfile } from '../types/whiteboard';
import {
  Sparkles,
  ArrowRight,
  Check,
  GraduationCap,
  Atom,
  Binary,
  FlaskConical,
  Dna,
  BookOpen,
  School,
  User,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: TeacherProfile) => void;
  isAddingExtraTeacher?: boolean;
  onCancel?: () => void;
}

const SUBJECT_OPTIONS: { id: SubjectId; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { id: 'physics', label: 'Physics', icon: <Atom className="w-5 h-5 text-sky-400" />, color: 'hover:border-sky-500/60 bg-sky-500/10', desc: 'Mechanics, Waves & Electricity' },
  { id: 'mathematics', label: 'Mathematics', icon: <Binary className="w-5 h-5 text-emerald-400" />, color: 'hover:border-emerald-500/60 bg-emerald-500/10', desc: 'Algebra, Geometry & Functions' },
  { id: 'chemistry', label: 'Chemistry', icon: <FlaskConical className="w-5 h-5 text-violet-400" />, color: 'hover:border-violet-500/60 bg-violet-500/10', desc: 'Stoichiometry & Reactions' },
  { id: 'biology', label: 'Biology', icon: <Dna className="w-5 h-5 text-teal-400" />, color: 'hover:border-teal-500/60 bg-teal-500/10', desc: 'Genetics, Cells & Physiology' },
  { id: 'english', label: 'English', icon: <BookOpen className="w-5 h-5 text-rose-400" />, color: 'hover:border-rose-500/60 bg-rose-500/10', desc: 'Analysis, PEEL & Literature' },
];

const AVATAR_COLORS = [
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-sky-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-amber-600',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  isAddingExtraTeacher = false,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(isAddingExtraTeacher ? 2 : 1);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Student'>('Teacher');
  const [school, setSchool] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['physics', 'mathematics']);
  const [avatarColor, setAvatarColor] = useState('bg-indigo-600');

  if (!isOpen) return null;

  const toggleSubject = (sId: SubjectId) => {
    if (selectedSubjects.includes(sId)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sId));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sId]);
    }
  };

  const handleFinish = () => {
    const finalName = name.trim() || (role === 'Teacher' ? 'Teacher' : 'Student');
    const newProfile: TeacherProfile = {
      id: `prof-${Date.now()}`,
      name: finalName,
      role,
      school: school.trim() || undefined,
      subjects: selectedSubjects.length > 0 ? selectedSubjects : ['physics'],
      avatarColor,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };
    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-800 w-full">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[460px]">
          {/* SCREEN 1: Welcome */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center my-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2 flex-wrap">
                <span>Welcome to ChalkBoard 👋</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                  CSB-Builds
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-sm mb-4 leading-relaxed">
                Your classroom, on one screen. Let&apos;s personalize your whiteboard in under 30 seconds.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mb-8">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Saved locally on this device • No accounts or passwords required</span>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 2: Name & Role */}
          {step === 2 && (
            <div className="flex flex-col my-auto">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Step 1 of 3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                What&apos;s your name?
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                This helps customize your whiteboard header and lesson notes.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name or Title
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Dr. Ahmed, Ms. Sara, Mr. Davis"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && name.trim()) setStep(3);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('Teacher')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'Teacher'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs">Teacher / Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Student')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      role === 'Student'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <School className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs">Student / Learner</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    School / Institution (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge International Academy"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
                {isAddingExtraTeacher && onCancel ? (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!name.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: Subjects Selection */}
          {step === 3 && (
            <div className="flex flex-col my-auto">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                Step 2 of 3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                What do you teach?
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Select one or more IGCSE disciplines. You can always switch anytime.
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {SUBJECT_OPTIONS.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-slate-800 border-indigo-500/80 shadow-xs'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${sub.color}`}>
                          {sub.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{sub.label}</div>
                          <div className="text-[11px] text-slate-400">{sub.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: Ready Confirmation */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center my-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-emerald-500/20">
                🎉
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                You&apos;re ready, {name || 'Teacher'}!
              </h2>
              <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
                ChalkBoard is now customized and ready on this computer.
              </p>

              {/* Profile Summary Card */}
              <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-left mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                    {(name || 'T').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{name}</div>
                    <div className="text-xs text-slate-400">{role} {school ? `• ${school}` : ''}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-700/60">
                  {selectedSubjects.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-medium text-slate-300 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Saved locally on this device • Ready for offline teaching</span>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Start Teaching →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
