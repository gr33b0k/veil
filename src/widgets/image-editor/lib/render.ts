import { getImageScale } from "@/features";
import type {
  Viewport,
  Rectangle,
  Point,
  Drawing,
  CensorType,
} from "@/features";
import { applyBlur, applyPixelization } from "./effects";

type RenderCacheParams = {
  cacheCanvas: HTMLCanvasElement;
  tempCanvas: HTMLCanvasElement;
  effectCanvas: HTMLCanvasElement;
  pixelateCanvas: HTMLCanvasElement;

  image: HTMLImageElement;

  drawings: Drawing[];
};

type DrawCanvasParams = {
  canvas: HTMLCanvasElement;
  tempCanvas: HTMLCanvasElement;
  cacheCanvas: HTMLCanvasElement;
  effectCanvas: HTMLCanvasElement;
  pixelateCanvas: HTMLCanvasElement;

  image: HTMLImageElement;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: Rectangle | null;
  drawingBrush: Point[];

  brushSize: number;
  effectIntensity: number;
  censorType: CensorType;
};

function drawRectangleMask(ctx: CanvasRenderingContext2D, rect: Rectangle) {
  const { x, y, width, height } = rect;

  ctx.fillRect(x, y, width, height);
}

function drawBrushPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  size: number,
) {
  if (points.length === 0) return;

  ctx.lineWidth = size;

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

function drawDrawingMask(ctx: CanvasRenderingContext2D, drawing: Drawing) {
  if (drawing.type === "rectangle") {
    drawRectangleMask(ctx, drawing.rectangle);
  }

  if (drawing.type === "brush") {
    drawBrushPath(ctx, drawing.points, drawing.size);
  }
}

export function renderCache({
  cacheCanvas,
  tempCanvas,
  effectCanvas,
  pixelateCanvas,
  image,
  drawings,
}: RenderCacheParams) {
  const cacheCtx = cacheCanvas.getContext("2d");
  const tempCtx = tempCanvas.getContext("2d");

  if (!cacheCtx || !tempCtx) return;

  cacheCtx.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);
  cacheCtx.drawImage(image, 0, 0);

  for (const drawing of drawings) {
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.save();
    tempCtx.lineCap = "round";
    tempCtx.lineJoin = "round";
    tempCtx.strokeStyle = "black";
    tempCtx.fillStyle = "black";

    drawDrawingMask(tempCtx, drawing);
    tempCtx.restore();

    if (drawing.censorType === "solid") {
      cacheCtx.drawImage(tempCanvas, 0, 0);
      continue;
    }

    if (drawing.censorType === "blur") {
      applyBlur(
        cacheCanvas,
        tempCanvas,
        effectCanvas,
        drawing.effectIntensity * (image.naturalWidth / 1920),
      );
    }

    if (drawing.censorType === "pixelate") {
      applyPixelization(
        cacheCanvas,
        tempCanvas,
        effectCanvas,
        pixelateCanvas,
        drawing.effectIntensity,
      );
    }

    cacheCtx.drawImage(effectCanvas, 0, 0);
  }
}

export function drawCanvas({
  canvas,
  tempCanvas,
  cacheCanvas,
  effectCanvas,
  pixelateCanvas,
  image,
  viewport,
  drawings,
  selectedDrawingId,
  drawingRect,
  drawingBrush,
  brushSize,
  effectIntensity,
  censorType,
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

  tmpCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

  tmpCtx.save();

  tmpCtx.lineCap = "round";
  tmpCtx.lineJoin = "round";
  tmpCtx.strokeStyle = "black";
  tmpCtx.fillStyle = "black";

  if (drawingBrush.length > 0) {
    drawBrushPath(tmpCtx, drawingBrush, brushSize);
  }

  if (drawingRect) {
    drawRectangleMask(tmpCtx, drawingRect);
  }

  tmpCtx.restore();

  const hasCurrentDrawing = drawingBrush.length > 0 || drawingRect !== null;

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(imageScale, imageScale);

  if (hasCurrentDrawing) {
    if (censorType === "blur")
      applyBlur(
        cacheCanvas,
        tempCanvas,
        effectCanvas,
        effectIntensity * (image.naturalWidth / 1920),
      );

    if (censorType === "pixelate")
      applyPixelization(
        cacheCanvas,
        tempCanvas,
        effectCanvas,
        pixelateCanvas,
        effectIntensity,
      );
  }

  ctx.drawImage(cacheCanvas, 0, 0);

  if (hasCurrentDrawing) {
    if (censorType !== "solid") {
      ctx.drawImage(effectCanvas, 0, 0);
    } else {
      ctx.drawImage(tempCanvas, 0, 0);
    }
  }

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
