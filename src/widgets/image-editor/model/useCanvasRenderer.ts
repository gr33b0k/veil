import type {
  CensorType,
  Drawing,
  Point,
  Rectangle,
  Viewport,
} from "@/features";
import { useEffect, useRef } from "react";
import { drawCanvas, renderCache } from "../lib/render";

type UseCanvasRendererParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  tempCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  cacheCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  blurCanvasRef: React.RefObject<HTMLCanvasElement | null>;

  imageElement: HTMLImageElement | null;
  viewport: Viewport;

  drawings: Drawing[];
  selectedDrawingId: string | null;

  drawingRect: React.RefObject<Rectangle | null>;
  drawingBrush: React.RefObject<Point[]>;

  brushSize: number;
  blurIntensity: number;

  censorType: CensorType;
};

export function useCanvasRenderer({
  canvasRef,
  tempCanvasRef,
  cacheCanvasRef,
  blurCanvasRef,
  imageElement,
  viewport,
  drawings,
  selectedDrawingId,
  drawingRect,
  drawingBrush,
  brushSize,
  blurIntensity,
  censorType,
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
      const blurCanvas = blurCanvasRef.current;

      if (!canvas || !tempCanvas || !cacheCanvas || !blurCanvas) return;

      drawCanvas({
        canvas,
        tempCanvas,
        cacheCanvas,
        blurCanvas,
        image: imageElement,
        viewport,
        drawings,
        selectedDrawingId,
        drawingRect: drawingRect.current,
        drawingBrush: drawingBrush.current,
        brushSize,
        blurIntensity,
        censorType,
      });
    });
  }

  useEffect(() => {
    scheduleDraw();
  }, [imageElement, viewport, drawings, selectedDrawingId]);

  useEffect(() => {
    if (!imageElement) return;

    const cacheCanvas = cacheCanvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    const blurCanvas = blurCanvasRef.current;

    if (!tempCanvas || !cacheCanvas || !blurCanvas) return;

    renderCache({
      cacheCanvas,
      tempCanvas,
      blurCanvas,
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
