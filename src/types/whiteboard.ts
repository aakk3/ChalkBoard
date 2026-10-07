export type SubjectId = 'physics' | 'mathematics' | 'chemistry' | 'biology' | 'english';

export type ToolType =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'line'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'axes'
  | 'text'
  | 'sticky'
  | 'laser'
  | 'hand';

export type GridType = 'blank' | 'dotted' | 'grid' | 'lined' | 'isometric';

export type CanvasTheme = 'dark' | 'light' | 'chalkboard' | 'sepia';

export type LineCap = 'round' | 'square';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface CanvasElement {
  id: string;
  type: ToolType;
  points: Point[];
  color: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
  fillColor?: string; // transparent or color
  opacity?: number;
  // For text element
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  // For bounding boxes / shapes
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface StickyNoteItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
  color: 'yellow' | 'pink' | 'green' | 'blue' | 'purple' | 'amber';
  pinned?: boolean;
  createdAt: number;
}

export interface BoardFile {
  id: string;
  subjectId: SubjectId;
  title: string;
  folder?: string;
  createdAt: number;
  updatedAt: number;
  elements: CanvasElement[];
  stickyNotes: StickyNoteItem[];
  gridType: GridType;
  theme: CanvasTheme;
  pan: { x: number; y: number };
  zoom: number;
  // Teacher Scratchpad for this board
  scratchpadText: string;
  lessonObjective: string;
  syllabusCode: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  role: 'Teacher' | 'Student';
  subjects: SubjectId[];
  school?: string;
  avatarColor: string;
  createdAt: number;
  lastUsed: number;
}

export interface ColleagueProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  activeSubject: SubjectId;
}

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  icon: string;
  code: string;
  level: string;
  color: string;
  badgeBg: string;
  accentHex: string;
  description: string;
  defaultGrid: GridType;
  quickSymbols: string[];
  formulae: { category: string; items: { name: string; formula: string }[] }[];
  templates: {
    id: string;
    name: string;
    description: string;
    category: string;
    apply: (originX: number, originY: number) => { elements: CanvasElement[]; stickyNotes: StickyNoteItem[] };
  }[];
}

export interface DeviceBackupData {
  version: number;
  exportedAt: number;
  deviceLabel: string;
  activeProfileId: string;
  profiles: TeacherProfile[];
  boards: BoardFile[];
}
