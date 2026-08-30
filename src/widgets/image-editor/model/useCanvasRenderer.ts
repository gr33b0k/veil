import type { Drawing, Point, Rectangle, Viewport } from "@/features";
import { useEffect, useRef } from "react";
import { drawCanvas, renderCache } from "../lib/render";

type UseCanvasRendererParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  tempCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  cacheCanvasRef: React.RefObject<HTMLCanvasElement | null>;

  imageElement: HTMLImageElement | null;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: React.RefObject<Rectangle | null>;
  drawingBrush: React.RefObject<Point[]>;
};

export function useCanvasRenderer({
  canvasRef,
  tempCanvasRef,
  cacheCanvasRef,
  imageElement,
  viewport,
  drawings,
  selectedDrawingId,
  drawingRect,
  drawingBrush,
}: UseCanvasRendererParams) {
  const animationFrameRef = useRef<number | null>(null);

  function scheduleDraw() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;

      if (!imageElement) return;

      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      const cacheCanvas = cacheCanvasRef.current;

      if (!canvas || !tempCanvas || !cacheCanvas) return;

      drawCanvas({
        canvas,
        tempCanvas,
        cacheCanvas,
        image: imageElement,
        viewport,
        drawings,
        selectedDrawingId,
        drawingRect: drawingRect.current,
        drawingBrush: drawingBrush.current,
      });
    });
  }

  useEffect(() => {
    scheduleDraw();
  }, [imageElement, viewport, drawings, selectedDrawingId]);

  useEffect(() => {
    if (!imageElement) return;

    const canvas = canvasRef.current;
    const cacheCanvas = cacheCanvasRef.current;

    if (!canvas || !cacheCanvas) return;

    renderCache({
      cacheCanvas,
      image: imageElement,
      drawings,
    });
  }, [imageElement, drawings]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return { scheduleDraw };
}
