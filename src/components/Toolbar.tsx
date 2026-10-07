import React, { useState } from 'react';
import {
  MousePointer,
  Pen,
  Highlighter,
  Eraser,
  Minus,
  MoveRight,
  Square,
  Circle,
  Triangle,
  Grid3X3,
  Type,
  StickyNote,
  Flame,
  Hand,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ChevronDown,
  Palette,
  Sliders,
} from 'lucide-react';
import { ToolType, StrokeStyle, CanvasTheme, GridType } from '../types/whiteboard';
import { COLOR_PALETTE } from '../constants/subjects';

interface ToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  strokeStyle: StrokeStyle;
  setStrokeStyle: (style: StrokeStyle) => void;
  hasFill: boolean;
  setHasFill: (fill: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  gridType: GridType;
  setGridType: (grid: GridType) => void;
  theme: CanvasTheme;
  setTheme: (theme: CanvasTheme) => void;
  onOpenTemplates: () => void;
  onToggleFullscreen: () => void;
  activeSubjectAccent: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  strokeStyle,
  setStrokeStyle,
  hasFill,
  setHasFill,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  gridType,
  setGridType,
  theme,
  setTheme,
  onOpenTemplates,
  onToggleFullscreen,
  activeSubjectAccent,
}) => {
  const [showColorPopover, setShowColorPopover] = useState(false);
  const [showStrokePopover, setShowStrokePopover] = useState(false);
  const [showGridPopover, setShowGridPopover] = useState(false);

  const tools: { id: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', label: 'Select / Move', icon: <MousePointer className="w-4 h-4" />, shortcut: 'V' },
    { id: 'pen', label: 'Pen', icon: <Pen className="w-4 h-4" />, shortcut: 'P' },
    { id: 'highlighter', label: 'Highlighter', icon: <Highlighter className="w-4 h-4" />, shortcut: 'H' },
    { id: 'eraser', label: 'Eraser', icon: <Eraser className="w-4 h-4" />, shortcut: 'E' },
    { id: 'line', label: 'Line', icon: <Minus className="w-4 h-4" />, shortcut: 'L' },
    { id: 'arrow', label: 'Vector Arrow', icon: <MoveRight className="w-4 h-4" />, shortcut: 'A' },
    { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-4 h-4" />, shortcut: 'R' },
    { id: 'circle', label: 'Circle / Ellipse', icon: <Circle className="w-4 h-4" />, shortcut: 'C' },
    { id: 'triangle', label: 'Triangle', icon: <Triangle className="w-4 h-4" />, shortcut: 'T' },
    { id: 'axes', label: 'Cartesian Axes', icon: <Grid3X3 className="w-4 h-4" />, shortcut: 'X' },
    { id: 'text', label: 'Text Box', icon: <Type className="w-4 h-4" />, shortcut: 'T' },
    { id: 'sticky', label: 'Sticky Note', icon: <StickyNote className="w-4 h-4" />, shortcut: 'S' },
    { id: 'laser', label: 'Laser Pointer', icon: <Flame className="w-4 h-4 text-red-400" />, shortcut: 'K' },
    { id: 'hand', label: 'Pan Canvas', icon: <Hand className="w-4 h-4" />, shortcut: 'Space' },
  ];

  const strokeWidths = [1, 2, 4, 8, 14, 22];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[96vw]">
      <div className="flex items-center gap-1.5 p-2 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-700/60 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-200">
        {/* Core Drawing Tools */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 px-1 scrollbar-none">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                title={`${t.label} (${t.shortcut})`}
                className={`relative group p-2.5 rounded-xl transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-inner shadow-sky-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                {t.icon}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full"
                    style={{ backgroundColor: activeSubjectAccent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-slate-700/60 mx-1 shrink-0" />

        {/* Color Palette Popover Trigger */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowColorPopover(!showColorPopover)}
            title="Stroke Color"
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 border border-slate-700/40 text-xs font-medium"
          >
            <div
              className="w-5 h-5 rounded-lg border-2 border-white/40 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showColorPopover && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 w-52 z-40">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Palette</span>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setColor(theme === 'light' ? c.light : c.dark);
                      setShowColorPopover(false);
                    }}
                    title={c.name}
                    className="w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: theme === 'light' ? c.light : c.dark }}
                  />
                ))}
              </div>
              <div className="mt-1 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Custom</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stroke Width & Style Popover */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowStrokePopover(!showStrokePopover)}
            title="Stroke Thickness & Style"
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 border border-slate-700/40 text-xs font-medium"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-3.5 bg-slate-200 rounded-full" style={{ height: Math.min(strokeWidth, 8) }} />
            </div>
            <span className="text-xs text-slate-300 font-mono">{strokeWidth}px</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showStrokePopover && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl flex flex-col gap-3 w-56 z-40">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Stroke Thickness</span>
              <div className="flex items-center justify-between gap-1">
                {strokeWidths.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setStrokeWidth(w);
                      setShowStrokePopover(false);
                    }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center text-xs font-mono transition-all ${
                      strokeWidth === w
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Line Style</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['solid', 'dashed', 'dotted'] as StrokeStyle[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStrokeStyle(st)}
                      className={`text-[11px] py-1 rounded-md capitalize border transition-all ${
                        strokeStyle === st
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                          : 'bg-slate-800/80 border-transparent text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Shape Fill</span>
                <button
                  onClick={() => setHasFill(!hasFill)}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all ${
                    hasFill
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {hasFill ? 'Fill On' : 'Outline'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid & Background Preset Trigger */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowGridPopover(!showGridPopover)}
            title="Grid & Whiteboard Style"
            className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 border border-slate-700/40 text-xs font-medium text-slate-300"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="text-xs capitalize">{gridType}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showGridPopover && (
            <div className="absolute bottom-full mb-3 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-3 rounded-2xl shadow-2xl flex flex-col gap-3 w-64 z-40">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Canvas Grid</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['grid', 'dotted', 'lined', 'isometric', 'blank'] as GridType[]).map((gt) => (
                  <button
                    key={gt}
                    onClick={() => {
                      setGridType(gt);
                      setShowGridPopover(false);
                    }}
                    className={`py-1.5 text-xs rounded-lg capitalize border transition-all ${
                      gridType === gt
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                        : 'bg-slate-800/70 border-slate-750 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {gt}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Canvas Surface</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'dark', label: 'Dark Slate', dot: '#090d16' },
                      { id: 'light', label: 'Whiteboard', dot: '#f8fafc' },
                      { id: 'chalkboard', label: 'Chalkboard', dot: '#142c22' },
                      { id: 'sepia', label: 'Parchment', dot: '#faf5ea' },
                    ] as { id: CanvasTheme; label: string; dot: string }[]
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowGridPopover(false);
                      }}
                      className={`flex items-center gap-2 p-1.5 text-xs rounded-lg border transition-all ${
                        theme === t.id
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                          : 'bg-slate-800/70 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: t.dot }} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-700/60 mx-1 shrink-0" />

        {/* Templates Stamp Button */}
        <button
          onClick={onOpenTemplates}
          title="Insert IGCSE Diagram / Stamp"
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Canvas */}
        <button
          onClick={onClear}
          title="Clear Whiteboard"
          className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-700/60 mx-1 shrink-0" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            title="Reset Zoom to 100%"
            className="px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-300 hover:bg-slate-800"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          title="Fullscreen Presentation (F11)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
