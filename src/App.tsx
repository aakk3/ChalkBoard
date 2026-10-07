/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SubjectId,
  ToolType,
  GridType,
  CanvasTheme,
  StrokeStyle,
  CanvasElement,
  BoardFile,
  StickyNoteItem,
  TeacherProfile,
  Point,
} from './types/whiteboard';
import { IGCSE_SUBJECTS, COLOR_PALETTE } from './constants/subjects';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { ScratchpadPanel } from './components/ScratchpadPanel';
import { StickyNotesLayer } from './components/StickyNotesLayer';
import { ClearModal, TemplatesModal, ShortcutsModal } from './components/Modals';
import { OnboardingModal } from './components/OnboardingModal';
import { TeacherSwitcherModal } from './components/TeacherSwitcherModal';
import { ProfileModal } from './components/ProfileModal';
import { RecoveryModal } from './components/RecoveryModal';
import { renderWhiteboard } from './utils/canvasRenderer';
import { exportBoardAsPNG, exportStandaloneHTML } from './utils/exportUtils';
import {
  saveProfilesToDevice,
  loadProfilesFromDevice,
  saveBoardsToDevice,
  loadBoardsFromDevice,
  saveRecoverySnapshot,
  getRecoverySnapshot,
  clearRecoverySnapshot,
  exportDeviceBackup,
  resetDeviceStorage,
} from './utils/localDatabase';
import {
  Plus,
  X,
  FileText,
  HelpCircle,
  Maximize2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Check,
} from 'lucide-react';

function generateInitialBoards(subject: SubjectId = 'physics'): BoardFile[] {
  const boards: BoardFile[] = [];

  // Physics default boards
  const physTpl = IGCSE_SUBJECTS.physics.templates[0].apply(200, 160);
  boards.push({
    id: 'phys-board-1',
    subjectId: 'physics',
    title: 'Lesson 1: Kinematics & Velocity-Time Graphs',
    folder: 'Mechanics (Year 10)',
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now() - 5000000,
    elements: physTpl.elements,
    stickyNotes: physTpl.stickyNotes,
    gridType: 'grid',
    theme: 'dark',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Key formula: v = u + at\nHomework: Past Paper 42 May/June Question 3\nRemind lab groups about light gate calibration.',
    lessonObjective: '1. Interpret slopes of displacement-time and velocity-time graphs.\n2. Deduce acceleration from gradient and distance from area.',
    syllabusCode: 'CIE 0625 / Section 1.2',
  });

  const physTpl2 = IGCSE_SUBJECTS.physics.templates[1].apply(180, 140);
  boards.push({
    id: 'phys-board-2',
    subjectId: 'physics',
    title: "Lesson 2: Light Refraction & Snell's Law",
    folder: 'Waves & Optics',
    createdAt: Date.now() - 8000000,
    updatedAt: Date.now() - 3000000,
    elements: physTpl2.elements,
    stickyNotes: [
      {
        id: 'optics-note',
        x: 480,
        y: 120,
        width: 220,
        height: 160,
        title: 'Critical Angle Definition',
        content: '• Angle of incidence in denser medium that yields 90° refraction.\n• sin(c) = 1 / n\n• Total Internal Reflection requires i > c',
        color: 'blue',
        createdAt: Date.now(),
      },
    ],
    gridType: 'dotted',
    theme: 'dark',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Formula: n = sin(i) / sin(r) = c / v\nDemonstration with semi-circular glass block ray box.',
    lessonObjective: '1. Describe internal reflection and calculate critical angle.',
    syllabusCode: 'CIE 0625 / Section 3.2.3',
  });

  // Mathematics default boards
  const mathTpl = IGCSE_SUBJECTS.mathematics.templates[0].apply(160, 160);
  boards.push({
    id: 'math-board-1',
    subjectId: 'mathematics',
    title: 'Coordinate Geometry & Straight Line Graphs',
    folder: 'Core & Extended',
    createdAt: Date.now() - 7000000,
    updatedAt: Date.now() - 2000000,
    elements: mathTpl.elements,
    stickyNotes: [
      {
        id: 'math-note-1',
        x: 450,
        y: 120,
        width: 220,
        height: 170,
        title: 'Key Coordinate Formulas',
        content: '• Gradient m = (y₂ - y₁) / (x₂ - x₁)\n• Midpoint M = ((x₁+x₂)/2, (y₁+y₂)/2)\n• Distance d = √((x₂-x₁)² + (y₂-y₁)²)\n• Perpendicular gradient: m₁ · m₂ = -1',
        color: 'green',
        createdAt: Date.now(),
      },
    ],
    gridType: 'grid',
    theme: 'chalkboard',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Check students understand negative reciprocal for perpendicular lines.\nExample: y = 2x + 3 -> perp slope = -1/2',
    lessonObjective: 'Master finding equation of lines passing through two points and finding perpendicular bisectors.',
    syllabusCode: 'CIE 0580 / Topic E2.10',
  });

  // Chemistry default board
  const chemTpl = IGCSE_SUBJECTS.chemistry.templates[0].apply(160, 140);
  boards.push({
    id: 'chem-board-1',
    subjectId: 'chemistry',
    title: 'Acids, Bases & Neutralization Titration',
    folder: 'Reactions & Analysis',
    createdAt: Date.now() - 6000000,
    updatedAt: Date.now() - 1000000,
    elements: chemTpl.elements,
    stickyNotes: chemTpl.stickyNotes,
    gridType: 'dotted',
    theme: 'dark',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Indicator transitions:\nMethyl orange: Red (acid) -> Yellow (alkali)\nPhenolphthalein: Colorless (acid) -> Pink (alkali)',
    lessonObjective: '1. Describe the preparation of salts by titration.\n2. Calculate concentration in g/dm³ and mol/dm³.',
    syllabusCode: 'CIE 0620 / Topic 8.3',
  });

  // Biology default board
  const bioTpl = IGCSE_SUBJECTS.biology.templates[0].apply(160, 120);
  boards.push({
    id: 'bio-board-1',
    subjectId: 'biology',
    title: 'Monohybrid Crosses & Punnett Squares',
    folder: 'Genetics & Inheritance',
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now() - 500000,
    elements: bioTpl.elements,
    stickyNotes: bioTpl.stickyNotes,
    gridType: 'blank',
    theme: 'light',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Key vocabulary definitions:\n• Allele: alternative version of gene\n• Heterozygous: Bb\n• Homozygous: BB or bb\n• Phenotype: observable characteristic',
    lessonObjective: 'Predict the results of monohybrid crosses including 1:1 and 3:1 phenotypic ratios.',
    syllabusCode: 'CIE 0610 / Topic 17.2',
  });

  // English default board
  const engTpl = IGCSE_SUBJECTS.english.templates[0].apply(120, 120);
  boards.push({
    id: 'eng-board-1',
    subjectId: 'english',
    title: 'Paper 1: PEEL Analytical Paragraph Workshop',
    folder: 'Reading & Analysis',
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 200000,
    elements: engTpl.elements,
    stickyNotes: engTpl.stickyNotes,
    gridType: 'lined',
    theme: 'sepia',
    pan: { x: 0, y: 0 },
    zoom: 1,
    scratchpadText: 'Quotes to analyze from Extract B:\n"The menacing thunder roared like an untamed beast"\nTechniques: Personification, Auditory imagery, Simile.',
    lessonObjective: 'Construct high-level analytical paragraphs using Point, Evidence, Explanation and Link.',
    syllabusCode: 'CIE 0500 / Paper 1 Question 2',
  });

  return boards;
}

export default function App() {
  // Device Local Profiles State
  const [profiles, setProfiles] = useState<TeacherProfile[]>(() => {
    const loaded = loadProfilesFromDevice();
    return loaded.profiles;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const loaded = loadProfilesFromDevice();
    return loaded.activeProfileId || (loaded.profiles[0]?.id ?? '');
  });

  // Current active profile object
  const activeProfile: TeacherProfile =
    profiles.find((p) => p.id === activeProfileId) ||
    profiles[0] || {
      id: 'default-teacher',
      name: 'Teacher',
      role: 'Teacher',
      subjects: ['physics', 'mathematics'],
      avatarColor: 'bg-indigo-600',
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

  // First-time onboarding modal
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return profiles.length === 0;
  });
  const [isAddingExtraTeacher, setIsAddingExtraTeacher] = useState<boolean>(false);

  // Returning user greeting banner
  const [welcomeGreeting, setWelcomeGreeting] = useState<string | null>(null);

  useEffect(() => {
    if (profiles.length > 0 && activeProfile?.name) {
      setWelcomeGreeting(`Welcome back, ${activeProfile.name} 👋`);
      const timer = setTimeout(() => setWelcomeGreeting(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeProfileId]);

  // Active Subject (defaults to active teacher's first subject)
  const [activeSubject, setActiveSubject] = useState<SubjectId>(() => {
    if (activeProfile?.subjects?.length > 0) {
      return activeProfile.subjects[0];
    }
    return 'physics';
  });

  // Boards State
  const [boards, setBoards] = useState<BoardFile[]>(() => {
    const loaded = loadBoardsFromDevice();
    if (loaded && loaded.length > 0) return loaded;
    return generateInitialBoards();
  });

  // Active board ID
  const [activeBoardId, setActiveBoardId] = useState<string>(() => {
    const subjectBoards = boards.filter((b) => b.subjectId === activeSubject);
    return subjectBoards.length > 0 ? subjectBoards[0].id : boards[0]?.id || '';
  });

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  // Tool & drawing settings
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#38bdf8');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>('solid');
  const [hasFill, setHasFill] = useState<boolean>(false);

  // Undo / Redo history
  const [undoStack, setUndoStack] = useState<CanvasElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([]);

  // UI Panels & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showClearModal, setShowClearModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showTeacherSwitcher, setShowTeacherSwitcher] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Crash Recovery
  const [recoveredSnapshot, setRecoveredSnapshot] = useState<BoardFile | null>(null);

  // Check for recovery snapshot on startup
  useEffect(() => {
    const snapshot = getRecoverySnapshot();
    if (snapshot && snapshot.board && snapshot.board.elements.length > 0) {
      const existing = boards.find((b) => b.id === snapshot.board.id);
      if (!existing || existing.elements.length < snapshot.board.elements.length) {
        setRecoveredSnapshot(snapshot.board);
      }
    }
  }, []);

  // Canvas Refs & Drawing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const isPanningRef = useRef(false);
  const isSpacePressedRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);
  const [laserPoints, setLaserPoints] = useState<Point[]>([]);

  // Periodic device auto-save
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        saveBoardsToDevice(boards);
        if (activeBoard) {
          saveRecoverySnapshot(activeBoard);
        }
      } catch (err) {
        console.error('Storage save error:', err);
      }
      setIsSaving(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [boards, activeBoard]);

  // Save profile changes to device
  useEffect(() => {
    if (profiles.length > 0) {
      saveProfilesToDevice(profiles, activeProfileId);
    }
  }, [profiles, activeProfileId]);

  // Update subject accent color when switching subjects
  useEffect(() => {
    const config = IGCSE_SUBJECTS[activeSubject];
    if (config) {
      setColor(config.accentHex);
    }
  }, [activeSubject]);

  // Keep active board in sync when switching subject
  const handleSelectSubject = (sId: SubjectId) => {
    setActiveSubject(sId);
    const subjectBoards = boards.filter((b) => b.subjectId === sId);
    if (subjectBoards.length > 0) {
      setActiveBoardId(subjectBoards[0].id);
      setUndoStack([]);
      setRedoStack([]);
    } else {
      const newId = `${sId}-${Date.now()}`;
      const newBoard: BoardFile = {
        id: newId,
        subjectId: sId,
        title: `${IGCSE_SUBJECTS[sId].name} Board 1`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        elements: [],
        stickyNotes: [],
        gridType: IGCSE_SUBJECTS[sId].defaultGrid,
        theme: 'dark',
        pan: { x: 0, y: 0 },
        zoom: 1,
        scratchpadText: '',
        lessonObjective: '',
        syllabusCode: IGCSE_SUBJECTS[sId].code,
      };
      setBoards((prev) => [...prev, newBoard]);
      setActiveBoardId(newId);
    }
  };

  // Update active board property
  const updateActiveBoard = useCallback(
    (updates: Partial<BoardFile>) => {
      setBoards((prev) =>
        prev.map((b) => (b.id === activeBoardId ? { ...b, ...updates, updatedAt: Date.now() } : b))
      );
    },
    [activeBoardId]
  );

  // Undo / Redo
  const pushUndo = useCallback(() => {
    if (!activeBoard) return;
    setUndoStack((prev) => [...prev.slice(-40), [...activeBoard.elements]]);
    setRedoStack([]);
  }, [activeBoard]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !activeBoard) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, [...activeBoard.elements]]);
    updateActiveBoard({ elements: previous });
  }, [undoStack, activeBoard, updateActiveBoard]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || !activeBoard) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => [...prev, [...activeBoard.elements]]);
    updateActiveBoard({ elements: next });
  }, [redoStack, activeBoard, updateActiveBoard]);

  // Board CRUD
  const handleCreateBoard = (folder?: string) => {
    const newId = `${activeSubject}-${Date.now()}`;
    const newBoard: BoardFile = {
      id: newId,
      subjectId: activeSubject,
      title: `Lesson ${boards.filter((b) => b.subjectId === activeSubject).length + 1}: New Whiteboard`,
      folder: folder || 'IGCSE Notes',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      elements: [],
      stickyNotes: [],
      gridType: IGCSE_SUBJECTS[activeSubject].defaultGrid,
      theme: activeBoard?.theme || 'dark',
      pan: { x: 0, y: 0 },
      zoom: 1,
      scratchpadText: '',
      lessonObjective: '',
      syllabusCode: IGCSE_SUBJECTS[activeSubject].code,
    };
    setBoards((prev) => [newBoard, ...prev]);
    setActiveBoardId(newId);
  };

  const handleDuplicateBoard = (id: string) => {
    const target = boards.find((b) => b.id === id);
    if (!target) return;
    const dup: BoardFile = {
      ...target,
      id: `${target.subjectId}-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setBoards((prev) => [dup, ...prev]);
    setActiveBoardId(dup.id);
  };

  const handleDeleteBoard = (id: string) => {
    const remaining = boards.filter((b) => b.id !== id);
    if (remaining.length === 0) return;
    setBoards(remaining);
    if (activeBoardId === id) {
      const nextForSub = remaining.find((b) => b.subjectId === activeSubject);
      setActiveBoardId(nextForSub ? nextForSub.id : remaining[0].id);
    }
  };

  const handleRenameBoard = (id: string, newTitle: string) => {
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, title: newTitle } : b)));
  };

  // Convert screen coords to world coords
  const screenToWorld = useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !activeBoard) return { x: 0, y: 0 };
      const rawX = clientX - rect.left;
      const rawY = clientY - rect.top;
      return {
        x: (rawX - activeBoard.pan.x * activeBoard.zoom) / activeBoard.zoom,
        y: (rawY - activeBoard.pan.y * activeBoard.zoom) / activeBoard.zoom,
      };
    },
    [activeBoard]
  );

  // Canvas redraw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeBoard) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    renderWhiteboard({
      ctx,
      width,
      height,
      theme: activeBoard.theme,
      gridType: activeBoard.gridType,
      pan: activeBoard.pan,
      zoom: activeBoard.zoom,
      elements: activeBoard.elements,
      currentElement,
      laserPoints,
    });

    ctx.restore();
  }, [activeBoard, currentElement, laserPoints]);

  // Laser point decay
  useEffect(() => {
    if (laserPoints.length === 0) return;
    const timer = setTimeout(() => {
      setLaserPoints((prev) => prev.slice(1));
    }, 40);
    return () => clearTimeout(timer);
  }, [laserPoints]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeBoard) return;

    if (activeTool === 'hand' || e.button === 1 || isSpacePressedRef.current) {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - activeBoard.pan.x, y: e.clientY - activeBoard.pan.y };
      return;
    }

    if (e.button !== 0) return;

    const worldPoint = screenToWorld(e.clientX, e.clientY);

    if (activeTool === 'laser') {
      setLaserPoints([worldPoint]);
      return;
    }

    if (activeTool === 'sticky') {
      const newSticky: StickyNoteItem = {
        id: `sticky-${Date.now()}`,
        x: Math.round(worldPoint.x - 100),
        y: Math.round(worldPoint.y - 80),
        width: 220,
        height: 160,
        title: 'New Note',
        content: '',
        color: 'yellow',
        createdAt: Date.now(),
      };
      updateActiveBoard({ stickyNotes: [...activeBoard.stickyNotes, newSticky] });
      setActiveTool('select');
      return;
    }

    if (activeTool === 'text') {
      const text = prompt('Enter whiteboard text:', '');
      if (text && text.trim()) {
        pushUndo();
        const textElement: CanvasElement = {
          id: `text-${Date.now()}`,
          type: 'text',
          points: [worldPoint],
          color,
          fontSize: strokeWidth * 6 + 12,
          strokeWidth: 1,
          text: text.trim(),
        };
        updateActiveBoard({ elements: [...activeBoard.elements, textElement] });
      }
      return;
    }

    if (activeTool === 'eraser') {
      isDrawingRef.current = true;
      eraseAtPoint(worldPoint);
      return;
    }

    isDrawingRef.current = true;
    pushUndo();

    const newEl: CanvasElement = {
      id: `el-${Date.now()}`,
      type: activeTool,
      points: [worldPoint, worldPoint],
      color,
      strokeWidth,
      strokeStyle,
      fillColor: hasFill ? `${color}25` : 'transparent',
    };
    setCurrentElement(newEl);
  };

  const eraseAtPoint = (pt: Point) => {
    if (!activeBoard) return;
    const threshold = 18;
    const remaining = activeBoard.elements.filter((el) => {
      return !el.points.some((p) => Math.hypot(p.x - pt.x, p.y - pt.y) < threshold);
    });
    if (remaining.length !== activeBoard.elements.length) {
      updateActiveBoard({ elements: remaining });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeBoard) return;

    if (isPanningRef.current) {
      const newPan = {
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      };
      updateActiveBoard({ pan: newPan });
      return;
    }

    const worldPoint = screenToWorld(e.clientX, e.clientY);

    if (activeTool === 'laser') {
      setLaserPoints((prev) => [...prev.slice(-15), worldPoint]);
      return;
    }

    if (!isDrawingRef.current) return;

    if (activeTool === 'eraser') {
      eraseAtPoint(worldPoint);
      return;
    }

    if (currentElement) {
      if (activeTool === 'pen' || activeTool === 'highlighter') {
        setCurrentElement({
          ...currentElement,
          points: [...currentElement.points, worldPoint],
        });
      } else {
        setCurrentElement({
          ...currentElement,
          points: [currentElement.points[0], worldPoint],
        });
      }
    }
  };

  const handlePointerUp = () => {
    isPanningRef.current = false;
    if (isDrawingRef.current && currentElement && activeBoard) {
      updateActiveBoard({
        elements: [...activeBoard.elements, currentElement],
      });
      setCurrentElement(null);
    }
    isDrawingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!activeBoard) return;
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(3.0, Math.max(0.3, activeBoard.zoom * zoomFactor));
      updateActiveBoard({ zoom: newZoom });
    } else {
      updateActiveBoard({
        pan: {
          x: activeBoard.pan.x - e.deltaX / activeBoard.zoom,
          y: activeBoard.pan.y - e.deltaY / activeBoard.zoom,
        },
      });
    }
  };

  // Templates & Stamps
  const handleInsertTemplate = (templateId: string) => {
    const config = IGCSE_SUBJECTS[activeSubject];
    const tpl = config.templates.find((t) => t.id === templateId);
    if (!tpl || !activeBoard) return;

    pushUndo();
    const center = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const result = tpl.apply(center.x - 180, center.y - 120);

    updateActiveBoard({
      elements: [...activeBoard.elements, ...result.elements],
      stickyNotes: [...activeBoard.stickyNotes, ...result.stickyNotes],
    });
  };

  const handleInsertSymbol = (sym: string) => {
    if (!activeBoard) return;
    pushUndo();
    const center = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    const textEl: CanvasElement = {
      id: `sym-${Date.now()}`,
      type: 'text',
      points: [center],
      color,
      fontSize: 26,
      strokeWidth: 1,
      text: sym,
    };
    updateActiveBoard({ elements: [...activeBoard.elements, textEl] });
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (e.code === 'Space') {
        isSpacePressedRef.current = true;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'p':
          setActiveTool('pen');
          break;
        case 'h':
          setActiveTool('highlighter');
          break;
        case 'e':
          setActiveTool('eraser');
          break;
        case 'l':
          setActiveTool('line');
          break;
        case 'a':
          setActiveTool('arrow');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'c':
          setActiveTool('circle');
          break;
        case 't':
          setActiveTool('triangle');
          break;
        case 'x':
          setActiveTool('axes');
          break;
        case 's':
          setActiveTool('sticky');
          break;
        case 'k':
          setActiveTool('laser');
          break;
        case '?':
          setShowShortcutsModal(true);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleUndo, handleRedo]);

  // Onboarding completion
  const handleCompleteOnboarding = (newProfile: TeacherProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    if (newProfile.subjects.length > 0) {
      handleSelectSubject(newProfile.subjects[0]);
    }
    setShowOnboarding(false);
    setIsAddingExtraTeacher(false);
  };

  // Profile switching
  const handleSelectProfile = (p: TeacherProfile) => {
    setActiveProfileId(p.id);
    if (p.subjects.length > 0 && !p.subjects.includes(activeSubject)) {
      handleSelectSubject(p.subjects[0]);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    if (activeProfileId === profileId && remaining.length > 0) {
      setActiveProfileId(remaining[0].id);
    }
  };

  const handleUpdateProfile = (updates: Partial<TeacherProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, ...updates } : p))
    );
  };

  // Device Reset
  const handleResetDevice = async () => {
    await resetDeviceStorage();
    setProfiles([]);
    setActiveProfileId('');
    setBoards(generateInitialBoards());
    setShowOnboarding(true);
    setShowProfileModal(false);
  };

  // Backup & Restore
  const handleExportBackup = () => {
    exportDeviceBackup(profiles, activeProfileId, boards);
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.profiles && Array.isArray(parsed.profiles)) {
          setProfiles(parsed.profiles);
          if (parsed.activeProfileId) setActiveProfileId(parsed.activeProfileId);
        }
        if (parsed.boards && Array.isArray(parsed.boards)) {
          setBoards(parsed.boards);
          if (parsed.boards.length > 0) {
            setActiveBoardId(parsed.boards[0].id);
            if (parsed.boards[0].subjectId) setActiveSubject(parsed.boards[0].subjectId);
          }
        }
        alert('Device backup restored successfully!');
      } catch (err) {
        alert('Could not read backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const subjectConfig = IGCSE_SUBJECTS[activeSubject];
  const subjectBoards = boards.filter((b) => b.subjectId === activeSubject);

  return (
    <div
      ref={containerRef}
      className={`relative w-screen h-screen overflow-hidden select-none font-sans ${
        activeBoard?.theme === 'light' ? 'bg-slate-50' : 'bg-slate-950'
      }`}
    >
      {/* Returning User Welcome Greeting Banner */}
      {welcomeGreeting && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-white shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{welcomeGreeting}</span>
        </div>
      )}

      {/* Top Navigation & Multi-Tab File Bar */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ChalkBoard Brand Logo */}
          <div
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 cursor-pointer group pr-1"
            title="Open ChalkBoard Workspace"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              CB
            </div>
            <span className="font-bold text-sm text-slate-100 hidden sm:inline tracking-tight group-hover:text-emerald-400 transition-colors">
              ChalkBoard
            </span>
          </div>

          {/* Workspace Drawer Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs font-semibold shadow-xs transition-all"
            title="Open Workspace & File Drawer"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: subjectConfig.accentHex }}
            />
            <span className="font-bold">{subjectConfig.name}</span>
            <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
              ({subjectConfig.code.split('/')[0]})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Interactive Multi-Tab File Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[36vw] sm:max-w-[42vw] scrollbar-none py-0.5">
            {subjectBoards.map((b) => {
              const isActive = b.id === activeBoardId;
              return (
                <div
                  key={b.id}
                  onClick={() => setActiveBoardId(b.id)}
                  className={`group flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white border-indigo-500/60 shadow-xs'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="max-w-[120px] truncate">{b.title}</span>
                  {subjectBoards.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(b.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Quick Add Tab Button */}
            <button
              onClick={() => handleCreateBoard()}
              title="Add New Whiteboard"
              className="p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Top Status & Teacher Profile */}
        <div className="flex items-center gap-2">
          {/* CSB-Builds Tag */}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold tracking-wider">
            CSB-Builds
          </span>

          {/* Subtle Saved On Device Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{isSaving ? 'Saving...' : 'Saved on this device'}</span>
          </div>

          {/* Teacher Profile Button */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs font-semibold shadow-xs transition-all"
            title="My Profile & Device Settings"
          >
            <div
              className={`w-6 h-6 rounded-lg ${activeProfile.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}
            >
              {activeProfile.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-bold truncate max-w-[110px]">{activeProfile.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
          </button>

          {/* Teacher Scratchpad Drawer Trigger */}
          <button
            onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isScratchpadOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-inner'
                : 'bg-slate-800/90 text-slate-300 hover:text-white border-slate-700/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Teacher Panel</span>
          </button>

          {/* Shortcuts Help */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard Shortcuts (?)"
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen (F11)"
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 hidden sm:block"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Whiteboard Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className={`w-full h-full block touch-none ${
          activeTool === 'hand'
            ? 'cursor-grab active:cursor-grabbing'
            : activeTool === 'laser'
            ? 'cursor-crosshair'
            : activeTool === 'eraser'
            ? 'cursor-cell'
            : activeTool === 'sticky'
            ? 'cursor-copy'
            : 'cursor-crosshair'
        }`}
      />

      {/* Floating Interactive Sticky Notes Layer */}
      {activeBoard && (
        <StickyNotesLayer
          stickyNotes={activeBoard.stickyNotes}
          onUpdateNote={(noteId, updates) => {
            updateActiveBoard({
              stickyNotes: activeBoard.stickyNotes.map((n) => (n.id === noteId ? { ...n, ...updates } : n)),
            });
          }}
          onDeleteNote={(noteId) => {
            updateActiveBoard({
              stickyNotes: activeBoard.stickyNotes.filter((n) => n.id !== noteId),
            });
          }}
          pan={activeBoard.pan}
          zoom={activeBoard.zoom}
        />
      )}

      {/* Floating Ergonomic Toolbar */}
      {activeBoard && (
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          strokeStyle={strokeStyle}
          setStrokeStyle={setStrokeStyle}
          hasFill={hasFill}
          setHasFill={setHasFill}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={() => setShowClearModal(true)}
          zoom={activeBoard.zoom}
          onZoomIn={() => updateActiveBoard({ zoom: Math.min(3.0, activeBoard.zoom + 0.15) })}
          onZoomOut={() => updateActiveBoard({ zoom: Math.max(0.3, activeBoard.zoom - 0.15) })}
          onResetZoom={() => updateActiveBoard({ zoom: 1, pan: { x: 0, y: 0 } })}
          gridType={activeBoard.gridType}
          setGridType={(g) => updateActiveBoard({ gridType: g })}
          theme={activeBoard.theme}
          setTheme={(t) => updateActiveBoard({ theme: t })}
          onOpenTemplates={() => setShowTemplatesModal(true)}
          onToggleFullscreen={handleToggleFullscreen}
          activeSubjectAccent={subjectConfig.accentHex}
        />
      )}

      {/* Sidebar: Subject Hub, File Drawer & Device Persistence */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSubject={activeSubject}
        onSelectSubject={handleSelectSubject}
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={(id) => {
          setActiveBoardId(id);
          const b = boards.find((x) => x.id === id);
          if (b && b.subjectId !== activeSubject) {
            setActiveSubject(b.subjectId);
          }
        }}
        onCreateBoard={handleCreateBoard}
        onRenameBoard={handleRenameBoard}
        onDuplicateBoard={handleDuplicateBoard}
        onDeleteBoard={handleDeleteBoard}
        activeProfile={activeProfile}
        onOpenTeacherSwitcher={() => setShowTeacherSwitcher(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onExportPNG={() => activeBoard && exportBoardAsPNG(activeBoard)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onExportStandaloneHTML={() => activeBoard && exportStandaloneHTML(activeBoard, boards)}
        isSaving={isSaving}
      />

      {/* Side Collapsible Teaching Aids / Scratchpad Panel */}
      {activeBoard && (
        <ScratchpadPanel
          isOpen={isScratchpadOpen}
          setIsOpen={setIsScratchpadOpen}
          activeBoard={activeBoard}
          onUpdateBoard={updateActiveBoard}
          subjectConfig={subjectConfig}
          onInsertSymbol={handleInsertSymbol}
        />
      )}

      {/* MODALS */}

      {/* 1. First-Time Onboarding Modal (Open -> Identify once -> Teach) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
        isAddingExtraTeacher={isAddingExtraTeacher}
        onCancel={() => {
          setShowOnboarding(false);
          setIsAddingExtraTeacher(false);
        }}
      />

      {/* 2. Who's teaching today? Switcher Modal */}
      <TeacherSwitcherModal
        isOpen={showTeacherSwitcher}
        onClose={() => setShowTeacherSwitcher(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onAddNewTeacher={() => {
          setIsAddingExtraTeacher(true);
          setShowOnboarding(true);
        }}
        onDeleteProfile={handleDeleteProfile}
      />

      {/* 3. My Profile & Device Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={activeProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenTeacherSwitcher={() => setShowTeacherSwitcher(true)}
        onAddNewTeacher={() => {
          setIsAddingExtraTeacher(true);
          setShowOnboarding(true);
        }}
        onExportData={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetDevice={handleResetDevice}
      />

      {/* 4. Crash Recovery Modal */}
      {recoveredSnapshot && (
        <RecoveryModal
          isOpen={Boolean(recoveredSnapshot)}
          recoveredBoard={recoveredSnapshot}
          onOpenRecovered={() => {
            setBoards((prev) => {
              const existingIdx = prev.findIndex((b) => b.id === recoveredSnapshot.id);
              if (existingIdx >= 0) {
                const updated = [...prev];
                updated[existingIdx] = recoveredSnapshot;
                return updated;
              }
              return [recoveredSnapshot, ...prev];
            });
            setActiveBoardId(recoveredSnapshot.id);
            setActiveSubject(recoveredSnapshot.subjectId);
            clearRecoverySnapshot();
            setRecoveredSnapshot(null);
          }}
          onStartFresh={() => {
            clearRecoverySnapshot();
            setRecoveredSnapshot(null);
          }}
        />
      )}

      {/* 5. Clear Board Confirmation Modal */}
      <ClearModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={() => {
          pushUndo();
          updateActiveBoard({ elements: [], stickyNotes: [] });
        }}
      />

      {/* 6. IGCSE Diagrams & Stamps Modal */}
      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        subjectConfig={subjectConfig}
        onSelectTemplate={handleInsertTemplate}
      />

      {/* 7. Keyboard Shortcuts Cheat Sheet */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}
