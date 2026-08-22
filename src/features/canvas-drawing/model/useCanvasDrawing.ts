import { useRef, useState } from "react";
import type { Point, Rectangle, Drawing } from "./types";

export function useCanvasDrawing() {
  const [history, setHistory] = useState({
    drawings: [] as Drawing[],
    redoStack: [] as Drawing[],
  });

  const [drawingRect, setDrawingRect] = useState<Rectangle | null>(null);
  const [drawingBrush, setDrawingBrush] = useState<Point[]>([]);

  const startPoint = useRef<Point>({ x: 0, y: 0 });

  function addDrawing(drawing: Drawing) {
    setHistory((current) => ({
      drawings: [...current.drawings, drawing],
      redoStack: [],
    }));
  }

  function startRectangle(x: number, y: number) {
    startPoint.current = { x, y };
    setDrawingRect({ x, y, width: 0, height: 0 });
  }

  function updateRectangle(x: number, y: number) {
    setDrawingRect({
      x: startPoint.current.x,
      y: startPoint.current.y,
      width: x - startPoint.current.x,
      height: y - startPoint.current.y,
    });
  }

  function finishRectangle() {
    if (!drawingRect) return;

    if (drawingRect.width === 0 || drawingRect.height === 0) {
      setDrawingRect(null);
      return;
    }

    addDrawing({ type: "rectangle", rectangle: drawingRect });

    setDrawingRect(null);
  }

  function startBrush(x: number, y: number) {
    setDrawingBrush([{ x, y }]);
  }

  function updateBrush(x: number, y: number) {
    setDrawingBrush((current) => [...current, { x, y }]);
  }

  function finishBrush() {
    if (drawingBrush.length === 0) return;

    addDrawing({ type: "brush", points: drawingBrush });

    setDrawingBrush([]);
  }

  function undo() {
    setHistory((current) => {
      if (current.drawings.length === 0) return current;

      const lastDrawing = current.drawings[current.drawings.length - 1];

      return {
        drawings: current.drawings.slice(0, -1),
        redoStack: [...current.redoStack, lastDrawing],
      };
    });
  }

  function redo() {
    setHistory((current) => {
      if (current.redoStack.length === 0) return current;

      const drawing = current.redoStack[current.redoStack.length - 1];

      return {
        drawings: [...current.drawings, drawing],
        redoStack: current.redoStack.slice(0, -1),
      };
    });
  }

  return {
    drawings: history.drawings,
    drawingRect,
    drawingBrush,
    startRectangle,
    updateRectangle,
    finishRectangle,
    startBrush,
    updateBrush,
    finishBrush,
    undo,
    redo,
  };
}
