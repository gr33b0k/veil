import { getImageScale } from "@/features";
import type { Viewport, Rectangle, Point, Drawing } from "@/features";

type RenderCacheParams = {
  cacheCanvas: HTMLCanvasElement;

  image: HTMLImageElement;

  drawings: Drawing[];
};

type DrawCanvasParams = {
  canvas: HTMLCanvasElement;
  tempCanvas: HTMLCanvasElement;
  cacheCanvas: HTMLCanvasElement;

  image: HTMLImageElement;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: Rectangle | null;
  drawingBrush: Point[];
};

function drawRectangleMask(ctx: CanvasRenderingContext2D, rect: Rectangle) {
  const { x, y, width, height } = rect;

  ctx.fillRect(x, y, width, height);
}

function drawBrushPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length === 0) return;

  ctx.beginPath();

  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.stroke();
}

function drawSelection(
  ctx: CanvasRenderingContext2D,
  imageScale: number,
  drawing: Drawing,
) {
  ctx.save();

  ctx.strokeStyle = "#8167e7";
  ctx.lineWidth = 2 / imageScale;

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

function renderDrawingToCache(ctx: CanvasRenderingContext2D, drawing: Drawing) {
  if (drawing.type === "rectangle") {
    drawRectangleMask(ctx, drawing.rectangle);
  }

  if (drawing.type === "brush") {
    drawBrushPath(ctx, drawing.points);
  }
}

export function renderCache({
  cacheCanvas,
  image,
  drawings,
}: RenderCacheParams) {
  const ctx = cacheCanvas.getContext("2d");

  if (!ctx) return;

  ctx.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);

  ctx.save();

  ctx.lineWidth = 100;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";

  for (const drawing of drawings) {
    renderDrawingToCache(ctx, drawing);
  }

  ctx.globalCompositeOperation = "source-in";
  ctx.filter = "blur(50px)";
  ctx.drawImage(image, 0, 0);

  ctx.restore();
}

export function drawCanvas({
  canvas,
  tempCanvas,
  cacheCanvas,
  image,
  viewport,
  drawings,
  selectedDrawingId,
  drawingRect,
  drawingBrush,
}: DrawCanvasParams) {
  const ctx = canvas.getContext("2d");
  const tmpCtx = tempCanvas.getContext("2d");

  if (!ctx || !tmpCtx) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const scale = getImageScale({
    canvasWidth: rect.width,
    canvasHeight: rect.height,
    imageWidth: image.naturalWidth,
    imageHeight: image.naturalHeight,
  });

  const imageScale = scale * viewport.zoom;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(imageScale, imageScale);
  ctx.drawImage(image, 0, 0);

  ctx.restore();

  tmpCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  tmpCtx.save();

  tmpCtx.lineWidth = 100;
  tmpCtx.lineCap = "round";
  tmpCtx.lineJoin = "round";
  tmpCtx.strokeStyle = "black";
  tmpCtx.fillStyle = "black";

  if (drawingBrush.length > 0) {
    drawBrushPath(tmpCtx, drawingBrush);
  }

  if (drawingRect) {
    drawRectangleMask(tmpCtx, drawingRect);
  }

  tmpCtx.globalCompositeOperation = "source-in";
  tmpCtx.filter = "blur(50px)";
  tmpCtx.drawImage(image, 0, 0);

  tmpCtx.restore();

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(imageScale, imageScale);
  ctx.drawImage(cacheCanvas, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);

  ctx.restore();

  const selectedDrawing = drawings.find(
    (drawing) => drawing.id === selectedDrawingId,
  );

  if (selectedDrawing) {
    ctx.save();

    ctx.translate(viewport.x, viewport.y);
    ctx.scale(imageScale, imageScale);

    drawSelection(ctx, imageScale, selectedDrawing);

    ctx.restore();
  }
}
