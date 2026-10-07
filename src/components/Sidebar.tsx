import React, { useState } from 'react';
import {
  Atom,
  Binary,
  FlaskConical,
  Dna,
  BookOpen,
  Plus,
  Folder,
  FileText,
  Trash2,
  Copy,
  Edit2,
  ChevronRight,
  Download,
  Upload,
  Layers,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  Menu,
  X,
  FileCode,
  HardDrive,
  UserCheck,
} from 'lucide-react';
import { SubjectId, BoardFile, TeacherProfile } from '../types/whiteboard';
import { IGCSE_SUBJECTS } from '../constants/subjects';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
  boards: BoardFile[];
  activeBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: (folder?: string) => void;
  onRenameBoard: (boardId: string, newTitle: string) => void;
  onDuplicateBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  activeProfile: TeacherProfile;
  onOpenTeacherSwitcher: () => void;
  onOpenProfileModal: () => void;
  onExportPNG: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onExportStandaloneHTML: () => void;
  isSaving: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  activeSubject,
  onSelectSubject,
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
  onRenameBoard,
  onDuplicateBoard,
  onDeleteBoard,
  activeProfile,
  onOpenTeacherSwitcher,
  onOpenProfileModal,
  onExportPNG,
  onExportBackup,
  onImportBackup,
  onExportStandaloneHTML,
  isSaving,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const subjectConfig = IGCSE_SUBJECTS[activeSubject];

  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'physics':
        return <Atom className="w-4 h-4 text-sky-400" />;
      case 'mathematics':
        return <Binary className="w-4 h-4 text-emerald-400" />;
      case 'chemistry':
        return <FlaskConical className="w-4 h-4 text-violet-400" />;
      case 'biology':
        return <Dna className="w-4 h-4 text-teal-400" />;
      case 'english':
        return <BookOpen className="w-4 h-4 text-rose-400" />;
    }
  };

  const subjectBoards = boards.filter((b) => b.subjectId === activeSubject);

  // Extract unique folders
  const folders = Array.from(new Set(subjectBoards.map((b) => b.folder || 'Unfiled')));

  const filteredBoards = subjectBoards.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === 'all' || (selectedFolder === 'Unfiled' ? !b.folder : b.folder === selectedFolder);
    return matchesSearch && matchesFolder;
  });

  const handleStartRename = (board: BoardFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(board.id);
    setRenameValue(board.title);
  };

  const handleFinishRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameBoard(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md transition-all flex items-center gap-2"
          title="Open Workspace Drawer"
        >
          <Menu className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide">Workspace</span>
        </button>
      )}

      {/* Slide-over Backdrop on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding & Close Button */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-sm">
              CB
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                ChalkBoard
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                  IGCSE
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                  CSB-Builds
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Your classroom, on this screen</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Teacher Profile & Device Identity */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-indigo-400" /> This Device&apos;s Teacher
            </span>
            <button
              onClick={onOpenTeacherSwitcher}
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Switch Teacher →
            </button>
          </div>

          <button
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl ${activeProfile.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {activeProfile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                  {activeProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {activeProfile.role} {activeProfile.school ? `• ${activeProfile.school}` : ''}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Subject Hub Quick Selector */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-2 px-1 flex items-center justify-between">
            <span>Subject Workspace</span>
            <span className="text-[9px] font-mono text-slate-500">IGCSE CURRICULA</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {(Object.keys(IGCSE_SUBJECTS) as SubjectId[]).map((sId) => {
              const sub = IGCSE_SUBJECTS[sId];
              const isSelected = activeSubject === sId;
              const isTeacherSubject = activeProfile.subjects.includes(sId);

              return (
                <button
                  key={sId}
                  onClick={() => onSelectSubject(sId)}
                  title={`${sub.name} (${sub.code})`}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500/80 shadow-inner'
                      : 'border-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="mb-1">{getSubjectIcon(sId)}</div>
                  <span className={`text-[10px] font-medium leading-none ${isSelected ? 'text-white' : ''}`}>
                    {sub.name.slice(0, 4)}
                  </span>
                  {isTeacherSubject && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Subject Badge */}
          <div className="mt-2.5 p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectConfig.accentHex }} />
              <span className="text-xs font-semibold text-slate-200">{subjectConfig.name}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{subjectConfig.code.split('/')[0]}</span>
          </div>
        </div>

        {/* File / Lesson Boards Manager */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" /> Lesson Whiteboards
            </span>
            <button
              onClick={() => onCreateBoard(selectedFolder === 'all' ? undefined : selectedFolder)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold transition-all shadow-xs"
              title="Create New Lesson Board"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Board</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Folder tabs filter */}
          {folders.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none text-[10px]">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({subjectBoards.length})
              </button>
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    selectedFolder === f
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Board list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredBoards.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No whiteboards found. Click &quot;New Board&quot; to begin.
              </div>
            ) : (
              filteredBoards.map((b) => {
                const isActive = b.id === activeBoardId;
                const isRenaming = renamingId === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => onSelectBoard(b.id)}
                    className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-slate-800/90 border-indigo-500/50 shadow-sm text-slate-100'
                        : 'border-transparent hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <FileText
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}
                      />
                      {isRenaming ? (
                        <input
                          type="text"
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFinishRename(b.id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          onBlur={() => handleFinishRename(b.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white w-full outline-none"
                        />
                      ) : (
                        <div className="truncate flex-1">
                          <div className="text-xs font-medium truncate">{b.title}</div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {b.elements.length} strokes • {b.stickyNotes.length} notes
                            {b.folder ? ` • ${b.folder}` : ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(b, e)}
                        title="Rename"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBoard(b.id);
                        }}
                        title="Duplicate"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {subjectBoards.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete board "${b.title}"?`)) {
                              onDeleteBoard(b.id);
                            }
                          }}
                          title="Delete"
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Persistence & Friendly Save Indicator */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex flex-col gap-2">
          {/* Friendly Device Saved Status */}
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-medium">{isSaving ? 'Saving whiteboard...' : 'Saved on this device'}</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">{subjectBoards.length} lessons</span>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={onExportPNG}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all"
              title="Save Whiteboard as High-Res PNG Image"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Image</span>
            </button>
            <button
              onClick={onExportStandaloneHTML}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/40 transition-all"
              title="Download portable single-file HTML"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Offline HTML</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={onExportBackup}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-700/40"
              title="Export all profiles and whiteboards for USB backup"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>Export Backup</span>
            </button>
            <label
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-700/40 cursor-pointer"
              title="Restore from backup"
            >
              <Upload className="w-3 h-3 text-slate-400" />
              <span>Import Backup</span>
              <input type="file" accept=".mywhiteboard,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </aside>
    </>
  );
};
