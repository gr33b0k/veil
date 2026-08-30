import type { Drawing, Point, Rectangle, Viewport } from "@/features";
import { useEffect, useRef } from "react";
import { drawCanvas } from "../lib/drawCanvas";

type UseCanvasRendererParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  offscreenCanvasRef: React.RefObject<HTMLCanvasElement | null>;

  imageElement: HTMLImageElement | null;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: React.RefObject<Rectangle | null>;
  drawingBrush: React.RefObject<Point[]>;
};

export function useCanvasRenderer({
  canvasRef,
  offscreenCanvasRef,
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
      const offscreenCanvas = offscreenCanvasRef.current;

      if (!canvas || !offscreenCanvas) return;

      drawCanvas({
        canvas,
        offscreenCanvas,
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
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return { scheduleDraw };
}
