import type { Viewport } from "../model/types";

type ScreenToImageParams = {
  x: number;
  y: number;
  viewport: Viewport;
  scale: number;
  imageWidth: number;
  imageHeight: number;
};

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
