import { BoardFile, CanvasTheme } from '../types/whiteboard';
import { renderElement, THEME_COLORS, renderBackgroundAndGrid } from './canvasRenderer';

export function exportBoardAsPNG(board: BoardFile, scale = 2) {
  // Determine bounds or standard 1920x1080 canvas
  const width = 1920;
  const height = 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Render background & grid
  renderBackgroundAndGrid(ctx, width, height, board.theme, board.gridType, board.pan, board.zoom);

  // Render elements
  ctx.save();
  ctx.translate(board.pan.x * board.zoom, board.pan.y * board.zoom);
  ctx.scale(board.zoom, board.zoom);

  for (const el of board.elements) {
    renderElement(ctx, el);
  }

  // Render sticky notes onto the canvas
  for (const note of board.stickyNotes) {
    ctx.save();
    ctx.translate(note.x, note.y);

    // Sticky shadow
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Sticky background
    const bgColors: Record<string, string> = {
      yellow: '#fef08a',
      pink: '#fbcfe8',
      green: '#a7f3d0',
      blue: '#bae6fd',
      purple: '#ddd6fe',
      amber: '#fed7aa',
    };
    ctx.fillStyle = bgColors[note.color] || '#fef08a';
    ctx.beginPath();
    ctx.roundRect(0, 0, note.width, note.height, 8);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowColor = 'transparent';

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText(note.title, 12, 24);

    // Divider line
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 32);
    ctx.lineTo(note.width - 10, 32);
    ctx.stroke();

    // Content text with wrapping
    ctx.fillStyle = '#334155';
    ctx.font = '13px Inter, sans-serif';
    const lines = note.content.split('\n');
    let lineY = 48;
    for (const line of lines) {
      if (lineY > note.height - 12) break;
      ctx.fillText(line, 12, lineY);
      lineY += 18;
    }

    ctx.restore();
  }

  ctx.restore();

  // Add subtle header watermark: Subject & Title
  ctx.save();
  ctx.fillStyle = board.theme === 'light' || board.theme === 'sepia' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText(`ChalkBoard • ${board.title} • IGCSE ${board.subjectId.toUpperCase()}`, 24, height - 20);
  ctx.restore();

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${board.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_chalkboard.png`;
  link.href = dataUrl;
  link.click();
}

export function exportBoardAsJSON(board: BoardFile) {
  const jsonString = JSON.stringify(board, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${board.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_data.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportStandaloneHTML(board: BoardFile, allBoards: BoardFile[]) {
  const boardJson = JSON.stringify(board);
  const allJson = JSON.stringify(allBoards);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${board.title} - ChalkBoard (IGCSE Standalone)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
    canvas { touch-action: none; display: block; }
  </style>
</head>
<body class="bg-slate-900 text-white select-none">
  <div class="fixed top-3 left-4 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/60 shadow-xl">
    <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
    <span class="font-bold text-sm tracking-wide text-emerald-400">ChalkBoard Standalone</span>
    <span class="text-xs text-slate-400">|</span>
    <span class="text-xs font-semibold text-slate-200">${board.title} (${board.subjectId.toUpperCase()})</span>
  </div>

  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-2xl">
    <button id="tool-pen" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500">Pen</button>
    <button id="tool-eraser" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700">Eraser</button>
    <button id="tool-clear" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/30 text-red-300 hover:bg-red-600/50">Clear</button>
    <div class="w-px h-5 bg-slate-700 mx-1"></div>
    <button id="tool-save" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500">Save PNG</button>
  </div>

  <canvas id="canvas"></canvas>

  <script>
    const boardData = ${boardJson};
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let elements = boardData.elements || [];
    let isDrawing = false;
    let activeTool = 'pen';
    let currentColor = '#38bdf8';
    let currentStroke = [];

    function render() {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw elements
      elements.forEach(el => {
        if (!el.points || el.points.length === 0) return;
        ctx.strokeStyle = el.color || '#38bdf8';
        ctx.lineWidth = el.strokeWidth || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      });

      if (currentStroke.length > 0) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
          ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
      }
    }

    render();

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      render();
    });

    canvas.addEventListener('pointerdown', e => {
      isDrawing = true;
      currentStroke = [{ x: e.clientX, y: e.clientY }];
    });

    canvas.addEventListener('pointermove', e => {
      if (!isDrawing) return;
      currentStroke.push({ x: e.clientX, y: e.clientY });
      render();
    });

    canvas.addEventListener('pointerup', () => {
      if (isDrawing && currentStroke.length > 0) {
        elements.push({
          id: Date.now().toString(),
          type: 'pen',
          points: currentStroke,
          color: currentColor,
          strokeWidth: 3
        });
        currentStroke = [];
      }
      isDrawing = false;
      render();
    });

    document.getElementById('tool-clear').addEventListener('click', () => {
      if (confirm('Clear standalone whiteboard?')) {
        elements = [];
        render();
      }
    });

    document.getElementById('tool-save').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = '${board.title}_export.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = `${board.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_standalone.html`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}
