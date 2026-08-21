import { useRef, useState } from "react";
import type { Rectangle } from "./types";

export function useCanvasDrawing() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);

  const [drawingRectangle, setDrawingRectangle] = useState<Rectangle | null>(
    null,
  );

  const startPoint = useRef({ x: 0, y: 0 });

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

  return {
    rectangles,
    drawingRectangle,
    startRectangle,
    updateRectangle,
    finishRectangle,
  };
}
