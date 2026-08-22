import { getImageScale, type Rectangle, type Viewport } from "@/features";
import type { Point } from "@/features";

type DrawCanvasProps = {
  canvas: HTMLCanvasElement;
  offscreenCanvas: HTMLCanvasElement;
  image: HTMLImageElement;
  viewport: Viewport;

  rectangles: Rectangle[];
  drawingRectangle: Rectangle | null;

  brushStrokes: Point[][];
  drawingBrush: Point[];
};

export function drawCanvas({
  canvas,
  offscreenCanvas,
  image,
  viewport,
  rectangles,
  drawingRectangle,
  brushStrokes,
  drawingBrush,
}: DrawCanvasProps) {
  const ctx = canvas.getContext("2d");
  const offCtx = offscreenCanvas.getContext("2d");

  if (!ctx || !offCtx) return;

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  const scale = getImageScale(
    rect.width,
    rect.height,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(scale * viewport.zoom, scale * viewport.zoom);

  ctx.drawImage(image, 0, 0);

  ctx.restore();

  offCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  offCtx.save();

  offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  offCtx.translate(viewport.x, viewport.y);
  offCtx.scale(scale * viewport.zoom, scale * viewport.zoom);

  offCtx.lineWidth = 100;
  offCtx.lineCap = "round";
  offCtx.lineJoin = "round";
  offCtx.strokeStyle = "black";

  function drawRectangle(rect: Rectangle) {
    if (!ctx) return;

    const { x, y, width, height } = rect;

    ctx.save();

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    ctx.filter = "blur(20px)";

    ctx.drawImage(image, 0, 0);

    ctx.restore();
  }

  function drawBrushPath(points: Point[]) {
    if (points.length === 0 || !offCtx) return;

    offCtx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        offCtx.moveTo(point.x, point.y);
      } else {
        offCtx.lineTo(point.x, point.y);
      }
    });

    offCtx.stroke();
  }

  brushStrokes.forEach(drawBrushPath);

  if (drawingBrush.length > 0) {
    drawBrushPath(drawingBrush);
  }

  offCtx.globalCompositeOperation = "source-in";

  offCtx.filter = "blur(20px)";

  offCtx.drawImage(image, 0, 0);

  offCtx.restore();

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.drawImage(offscreenCanvas, 0, 0);

  ctx.restore();

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(scale * viewport.zoom, scale * viewport.zoom);

  if (drawingRectangle) {
    drawRectangle(drawingRectangle);
  }

  rectangles.forEach(drawRectangle);

  ctx.restore();
}
