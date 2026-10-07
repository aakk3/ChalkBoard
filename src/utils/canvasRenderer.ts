import { CanvasElement, CanvasTheme, GridType, Point } from '../types/whiteboard';

export interface RenderOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  theme: CanvasTheme;
  gridType: GridType;
  pan: { x: number; y: number };
  zoom: number;
  elements: CanvasElement[];
  currentElement?: CanvasElement | null;
  laserPoints?: Point[];
}

export const THEME_COLORS: Record<CanvasTheme, { bg: string; grid: string; text: string; subGrid?: string }> = {
  light: {
    bg: '#f8fafc',
    grid: 'rgba(148, 163, 184, 0.25)',
    subGrid: 'rgba(148, 163, 184, 0.12)',
    text: '#0f172a',
  },
  dark: {
    bg: '#090d16',
    grid: 'rgba(255, 255, 255, 0.1)',
    subGrid: 'rgba(255, 255, 255, 0.04)',
    text: '#f8fafc',
  },
  chalkboard: {
    bg: '#142c22',
    grid: 'rgba(167, 243, 208, 0.12)',
    subGrid: 'rgba(167, 243, 208, 0.05)',
    text: '#ecfdf5',
  },
  sepia: {
    bg: '#faf5ea',
    grid: 'rgba(180, 83, 9, 0.15)',
    subGrid: 'rgba(180, 83, 9, 0.06)',
    text: '#451a03',
  },
};

export function renderBackgroundAndGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: CanvasTheme,
  gridType: GridType,
  pan: { x: number; y: number },
  zoom: number
) {
  const themeColors = THEME_COLORS[theme];

  // Fill canvas background
  ctx.save();
  ctx.fillStyle = themeColors.bg;
  ctx.fillRect(0, 0, width, height);

  // For chalkboard, add subtle vintage texture vignette
  if (theme === 'chalkboard') {
    const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.8);
    grad.addColorStop(0, 'rgba(20, 52, 40, 0)');
    grad.addColorStop(1, 'rgba(8, 24, 18, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  if (gridType === 'blank') {
    ctx.restore();
    return;
  }

  const baseStep = 24 * zoom;
  const majorStep = baseStep * 5;

  const startX = (pan.x * zoom) % baseStep;
  const startY = (pan.y * zoom) % baseStep;

  if (gridType === 'dotted') {
    ctx.fillStyle = themeColors.grid;
    const dotRadius = Math.max(1, 1.2 * Math.min(zoom, 1.5));
    for (let x = startX; x < width; x += baseStep) {
      for (let y = startY; y < height; y += baseStep) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (gridType === 'grid') {
    // Minor grid lines
    ctx.strokeStyle = themeColors.subGrid || themeColors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = startX; x < width; x += baseStep) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, height);
    }
    for (let y = startY; y < height; y += baseStep) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
    }
    ctx.stroke();

    // Major grid lines (every 5 cells)
    const majorStartX = (pan.x * zoom) % majorStep;
    const majorStartY = (pan.y * zoom) % majorStep;
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = majorStartX; x < width; x += majorStep) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, height);
    }
    for (let y = majorStartY; y < height; y += majorStep) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
    }
    ctx.stroke();
  } else if (gridType === 'lined') {
    // Lined ruled paper for notes/English essays
    const lineStep = 32 * zoom;
    const lineStartY = (pan.y * zoom) % lineStep;
    ctx.strokeStyle = themeColors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = lineStartY; y < height; y += lineStep) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(width, Math.floor(y) + 0.5);
    }
    ctx.stroke();

    // Red/accent left margin line
    const marginX = 80 * zoom + pan.x * zoom;
    if (marginX > 0 && marginX < width) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginX, 0);
      ctx.lineTo(marginX, height);
      ctx.stroke();
    }
  } else if (gridType === 'isometric') {
    const isoStep = 30 * zoom;
    ctx.fillStyle = themeColors.grid;
    const dotRadius = Math.max(1, 1.2 * Math.min(zoom, 1.5));
    let row = 0;
    for (let y = (pan.y * zoom) % (isoStep * 0.866); y < height; y += isoStep * 0.866) {
      const offsetX = (row % 2 === 0 ? 0 : isoStep / 2) + ((pan.x * zoom) % isoStep);
      for (let x = offsetX; x < width; x += isoStep) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      row++;
    }
  }

  ctx.restore();
}

export function renderElement(ctx: CanvasRenderingContext2D, el: CanvasElement, isPreview = false) {
  if (!el.points || el.points.length === 0) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (el.strokeStyle === 'dashed') {
    ctx.setLineDash([el.strokeWidth * 3, el.strokeWidth * 2]);
  } else if (el.strokeStyle === 'dotted') {
    ctx.setLineDash([el.strokeWidth, el.strokeWidth * 2]);
  } else {
    ctx.setLineDash([]);
  }

  if (el.type === 'highlighter') {
    ctx.strokeStyle = el.color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(16, el.strokeWidth * 3);
    ctx.lineCap = 'square';
  } else {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.strokeWidth;
    ctx.globalAlpha = el.opacity ?? 1;
  }

  if (el.fillColor && el.fillColor !== 'transparent') {
    ctx.fillStyle = el.fillColor;
  }

  const p0 = el.points[0];

  switch (el.type) {
    case 'pen':
    case 'highlighter': {
      if (el.points.length === 1) {
        ctx.beginPath();
        ctx.arc(p0.x, p0.y, el.strokeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < el.points.length - 1; i++) {
        const xc = (el.points[i].x + el.points[i + 1].x) / 2;
        const yc = (el.points[i].y + el.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, xc, yc);
      }
      const last = el.points[el.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
      break;
    }

    case 'line': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      }
      break;
    }

    case 'arrow': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const headLen = Math.max(12, el.strokeWidth * 3.5);

        // Shaft
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(
          p1.x - headLen * Math.cos(angle - Math.PI / 6),
          p1.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          p1.x - headLen * Math.cos(angle + Math.PI / 6),
          p1.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = el.color;
        ctx.fill();
      }
      break;
    }

    case 'rectangle': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        const x = Math.min(p0.x, p1.x);
        const y = Math.min(p0.y, p1.y);
        const w = Math.abs(p1.x - p0.x);
        const h = Math.abs(p1.y - p0.y);

        if (el.fillColor && el.fillColor !== 'transparent') {
          ctx.fillRect(x, y, w, h);
        }
        if (el.strokeWidth > 0) {
          ctx.strokeRect(x, y, w, h);
        }
      }
      break;
    }

    case 'circle': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        const cx = (p0.x + p1.x) / 2;
        const cy = (p0.y + p1.y) / 2;
        const rx = Math.abs(p1.x - p0.x) / 2;
        const ry = Math.abs(p1.y - p0.y) / 2;

        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
        if (el.fillColor && el.fillColor !== 'transparent') {
          ctx.fill();
        }
        if (el.strokeWidth > 0) {
          ctx.stroke();
        }
      }
      break;
    }

    case 'triangle': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        const minX = Math.min(p0.x, p1.x);
        const maxX = Math.max(p0.x, p1.x);
        const minY = Math.min(p0.y, p1.y);
        const maxY = Math.max(p0.y, p1.y);
        const midX = (minX + maxX) / 2;

        ctx.beginPath();
        ctx.moveTo(midX, minY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(minX, maxY);
        ctx.closePath();

        if (el.fillColor && el.fillColor !== 'transparent') {
          ctx.fill();
        }
        if (el.strokeWidth > 0) {
          ctx.stroke();
        }
      }
      break;
    }

    case 'axes': {
      if (el.points.length > 1) {
        const p1 = el.points[el.points.length - 1];
        const minX = Math.min(p0.x, p1.x);
        const maxX = Math.max(p0.x, p1.x);
        const minY = Math.min(p0.y, p1.y);
        const maxY = Math.max(p0.y, p1.y);
        const midX = minX + 30;
        const midY = maxY - 30;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(minX, midY);
        ctx.lineTo(maxX, midY);
        ctx.stroke();

        // X arrow
        const head = 10;
        ctx.beginPath();
        ctx.moveTo(maxX, midY);
        ctx.lineTo(maxX - head, midY - head / 2);
        ctx.lineTo(maxX - head, midY + head / 2);
        ctx.closePath();
        ctx.fillStyle = el.color;
        ctx.fill();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(midX, maxY);
        ctx.lineTo(midX, minY);
        ctx.stroke();

        // Y arrow
        ctx.beginPath();
        ctx.moveTo(midX, minY);
        ctx.lineTo(midX - head / 2, minY + head);
        ctx.lineTo(midX + head / 2, minY + head);
        ctx.closePath();
        ctx.fillStyle = el.color;
        ctx.fill();

        // Tick marks along X
        const step = 35;
        ctx.lineWidth = 1.5;
        for (let x = midX + step; x < maxX - 15; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, midY - 4);
          ctx.lineTo(x, midY + 4);
          ctx.stroke();
        }
        // Tick marks along Y
        for (let y = midY - step; y > minY + 15; y -= step) {
          ctx.beginPath();
          ctx.moveTo(midX - 4, y);
          ctx.lineTo(midX + 4, y);
          ctx.stroke();
        }

        // Labels
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = el.color;
        ctx.fillText('x', maxX - 5, midY + 18);
        ctx.fillText('y', midX - 16, minY + 10);
        ctx.fillText('O', midX - 14, midY + 16);
      }
      break;
    }

    case 'text': {
      if (el.text) {
        const fontSize = el.fontSize || 18;
        ctx.font = `${fontSize}px ${el.fontFamily || 'Inter, sans-serif'}`;
        ctx.fillStyle = el.color;
        const lines = el.text.split('\n');
        lines.forEach((line, idx) => {
          ctx.fillText(line, p0.x, p0.y + idx * (fontSize * 1.3));
        });
      }
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

export function renderWhiteboard(options: RenderOptions) {
  const { ctx, width, height, theme, gridType, pan, zoom, elements, currentElement, laserPoints } = options;

  // Clear & background
  ctx.clearRect(0, 0, width, height);
  renderBackgroundAndGrid(ctx, width, height, theme, gridType, pan, zoom);

  // Apply camera transformation for drawing elements
  ctx.save();
  ctx.translate(pan.x * zoom, pan.y * zoom);
  ctx.scale(zoom, zoom);

  // Render all committed elements
  for (const el of elements) {
    renderElement(ctx, el);
  }

  // Render currently in-progress drawing element
  if (currentElement) {
    renderElement(ctx, currentElement, true);
  }

  // Render Laser pointer trails if active
  if (laserPoints && laserPoints.length > 0) {
    ctx.save();
    for (let i = 0; i < laserPoints.length; i++) {
      const pt = laserPoints[i];
      const alpha = (i + 1) / laserPoints.length;
      const radius = Math.max(3, 8 * alpha);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}
