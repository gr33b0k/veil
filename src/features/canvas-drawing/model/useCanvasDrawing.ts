import { useRef, useState } from "react";
import type { Point, Rectangle } from "./types";

export function useCanvasDrawing() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);

  const [drawingRectangle, setDrawingRectangle] = useState<Rectangle | null>(
    null,
  );

  const [brushStrokes, setBrushStrokes] = useState<Point[][]>([]);

  const [drawingBrush, setDrawingBrush] = useState<Point[]>([]);

  const startPoint = useRef<Point>({ x: 0, y: 0 });

  function startRectangle(x: number, y: number) {
    startPoint.current = { x, y };
    setDrawingRectangle({ x, y, width: 0, height: 0 });
  }

  function updateRectangle(x: number, y: number) {
    setDrawingRectangle({
      x: startPoint.current.x,
      y: startPoint.current.y,
      width: x - startPoint.current.x,
      height: y - startPoint.current.y,
    });
  }

  function finishRectangle() {
    if (!drawingRectangle) return;

    if (drawingRectangle.width === 0 || drawingRectangle.height === 0) {
      setDrawingRectangle(null);
      return;
    }

    setRectangles((current) => [...current, drawingRectangle]);
    setDrawingRectangle(null);
  }

  function startBrush(x: number, y: number) {
    setDrawingBrush([{ x, y }]);
  }

  function updateBrush(x: number, y: number) {
    setDrawingBrush((current) => [...current, { x, y }]);
  }

  function finishBrush() {
    if (drawingBrush.length === 0) return;

    setBrushStrokes((current) => [...current, drawingBrush]);
    setDrawingBrush([]);
  }

  return {
    rectangles,
    drawingRectangle,
    brushStrokes,
    drawingBrush,
    startRectangle,
    updateRectangle,
    finishRectangle,
    startBrush,
    updateBrush,
    finishBrush,
  };
}
