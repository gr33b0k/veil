import type { Viewport } from "../model/types";

type ScreenToImageParams = {
  x: number;
  y: number;
  viewport: Viewport;
  scale: number;
};

export function screenToImage({ x, y, viewport, scale }: ScreenToImageParams) {
  const totalScale = scale * viewport.zoom;

  return {
    x: (x - viewport.x) / totalScale,
    y: (y - viewport.y) / totalScale,
  };
}
