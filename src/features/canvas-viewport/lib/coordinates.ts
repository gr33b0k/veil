import type { Viewport } from "../model/types";

type GetImageScaleParams = {
  canvasWidth: number;
  canvasHeight: number;
  imageWidth: number;
  imageHeight: number;
};

type ScreenToImageParams = {
  x: number;
  y: number;
  viewport: Viewport;
  scale: number;
  imageWidth: number;
  imageHeight: number;
};

type GetCanvasPointParams = {
  x: number;
  y: number;
  viewport: Viewport;
  canvas: HTMLCanvasElement;
  imageWidth: number;
  imageHeight: number;
};

export function getImageScale({
  canvasWidth,
  canvasHeight,
  imageWidth,
  imageHeight,
}: GetImageScaleParams) {
  const padding = 40;

  return Math.min(
    (canvasWidth - padding * 2) / imageWidth,
    (canvasHeight - padding * 2) / imageHeight,
  );
}

export function screenToImage({
  x,
  y,
  viewport,
  scale,
  imageWidth,
  imageHeight,
}: ScreenToImageParams) {
  const totalScale = scale * viewport.zoom;

  const imageX = (x - viewport.x) / totalScale;
  const imageY = (y - viewport.y) / totalScale;

  return {
    x: Math.max(0, Math.min(imageX, imageWidth)),
    y: Math.max(0, Math.min(imageY, imageHeight)),
  };
}

export function getCanvasPoint({
  x,
  y,
  viewport,
  canvas,
  imageWidth,
  imageHeight,
}: GetCanvasPointParams) {
  const rect = canvas.getBoundingClientRect();

  const canvasX = x - rect.left;
  const canvasY = y - rect.top;

  const scale = getImageScale({
    canvasWidth: rect.width,
    canvasHeight: rect.height,
    imageWidth,
    imageHeight,
  });

  return screenToImage({
    x: canvasX,
    y: canvasY,
    viewport,
    scale,
    imageWidth,
    imageHeight,
  });
}
