import React, { useState, useRef } from 'react';
import { StickyNoteItem } from '../types/whiteboard';
import { Pin, Trash2, Palette, GripHorizontal } from 'lucide-react';
import { STICKY_COLORS } from '../constants/subjects';

interface StickyNotesLayerProps {
  stickyNotes: StickyNoteItem[];
  onUpdateNote: (noteId: string, updates: Partial<StickyNoteItem>) => void;
  onDeleteNote: (noteId: string) => void;
  pan: { x: number; y: number };
  zoom: number;
}

export const StickyNotesLayer: React.FC<StickyNotesLayerProps> = ({
  stickyNotes,
  onUpdateNote,
  onDeleteNote,
  pan,
  zoom,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; noteX: number; noteY: number }>({
    mouseX: 0,
    mouseY: 0,
    noteX: 0,
    noteY: 0,
  });

  const handlePointerDown = (note: StickyNoteItem, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingId(note.id);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      noteX: note.x,
      noteY: note.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (note: StickyNoteItem, e: React.PointerEvent) => {
    if (draggingId !== note.id) return;
    const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
    const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;
    onUpdateNote(note.id, {
      x: Math.round(dragStartRef.current.noteX + dx),
      y: Math.round(dragStartRef.current.noteY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      setDraggingId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      {stickyNotes.map((note) => {
        // Calculate screen coordinates based on board pan and zoom
        const screenX = note.x * zoom + pan.x * zoom;
        const screenY = note.y * zoom + pan.y * zoom;

        // Color classes
        const colorConfig = STICKY_COLORS.find((c) => c.id === note.color) || STICKY_COLORS[0];

        return (
          <div
            key={note.id}
            style={{
              transform: `translate(${screenX}px, ${screenY}px) scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${note.width}px`,
              minHeight: `${note.height}px`,
            }}
            className={`absolute pointer-events-auto rounded-xl p-3 shadow-xl backdrop-blur-sm border transition-shadow ${colorConfig.bg} ${colorConfig.border} ${
              draggingId === note.id ? 'shadow-2xl ring-2 ring-indigo-500/50 cursor-grabbing' : 'hover:shadow-2xl'
            }`}
          >
            {/* Header / Drag Handle */}
            <div
              onPointerDown={(e) => handlePointerDown(note, e)}
              onPointerMove={(e) => handlePointerMove(note, e)}
              onPointerUp={handlePointerUp}
              className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <GripHorizontal className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Note Title"
                  className={`bg-transparent font-bold text-xs w-full focus:outline-none ${colorConfig.text}`}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {/* Color dots picker */}
                <div className="flex items-center gap-1 mr-1">
                  {STICKY_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateNote(note.id, { color: c.id as any });
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-transform hover:scale-125 ${
                        note.color === c.id ? 'ring-1 ring-black/40 dark:ring-white/60 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.dot }}
                      title={c.id}
                    />
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="p-1 rounded text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                  title="Delete Note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Content Textarea */}
            <textarea
              value={note.content}
              onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
              placeholder="Write lesson notes, definitions, or bullet points here..."
              className={`w-full bg-transparent resize-none text-xs leading-relaxed focus:outline-none font-sans min-h-[90px] ${colorConfig.text}`}
            />
          </div>
        );
      })}
    </div>
  );
};
