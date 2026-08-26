import { getImageScale } from "@/features";
import type { Viewport, Rectangle, Point, Drawing } from "@/features";

type DrawCanvasProps = {
  canvas: HTMLCanvasElement;
  offscreenCanvas: HTMLCanvasElement;
  image: HTMLImageElement;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: Rectangle | null;
  drawingBrush: Point[];
};

export function drawCanvas({
  canvas,
  offscreenCanvas,
  image,
  viewport,
  drawings,
  selectedDrawingId,
  drawingRect,
  drawingBrush,
}: DrawCanvasProps) {
  const ctx = canvas.getContext("2d");
  const offCtx = offscreenCanvas.getContext("2d");

  if (!ctx || !offCtx) return;

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  const scale = getImageScale({
    canvasWidth: rect.width,
    canvasHeight: rect.height,
    imageWidth: image.naturalWidth,
    imageHeight: image.naturalHeight,
  });

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

  function drawSelection(drawing: Drawing) {
    if (!ctx) return;

    ctx.save();

    ctx.strokeStyle = "#8167e7";
    ctx.lineWidth = 2 / (scale * viewport.zoom);

    if (drawing.type === "rectangle") {
      ctx.strokeRect(
        drawing.rectangle.x,
        drawing.rectangle.y,
        drawing.rectangle.width,
        drawing.rectangle.height,
      );
    }

    if (drawing.type === "brush") {
      ctx.beginPath();
      drawing.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();
    }

    ctx.restore();
  }

  for (const drawing of drawings) {
    if (drawing.type === "brush") {
      drawBrushPath(drawing.points);
    }
  }

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

  for (const drawing of drawings) {
    if (drawing.type === "rectangle") {
      drawRectangle(drawing.rectangle);
    }
  }

  if (drawingRect) {
    drawRectangle(drawingRect);
  }

  const selectedDrawing = drawings.find(
    (drawing) => drawing.id === selectedDrawingId,
  );

  if (selectedDrawing) {
    drawSelection(selectedDrawing);
  }

  ctx.restore();
}
