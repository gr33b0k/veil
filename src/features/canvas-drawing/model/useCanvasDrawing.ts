import { useRef, useState } from "react";
import type { Point, Rectangle, Drawing } from "./types";

export function useCanvasDrawing() {
  const [history, setHistory] = useState({
    drawings: [] as Drawing[],
    redoStack: [] as Drawing[],
  });

  const rectStart = useRef<Point>({ x: 0, y: 0 });
  const drawingRect = useRef<Rectangle | null>(null);
  const drawingBrush = useRef<Point[]>([]);

  function addDrawing(drawing: Drawing) {
    setHistory((current) => ({
      drawings: [...current.drawings, drawing],
      redoStack: [],
    }));
  }

  function deleteDrawing(drawingId: string) {
    setHistory((current) => {
      const drawing = current.drawings.find(
        (drawing) => drawingId === drawing.id,
      );

      if (!drawing) return current;

      return {
        drawings: current.drawings.filter(
          (drawing) => drawing.id !== drawingId,
        ),
        redoStack: [...current.redoStack, drawing],
      };
    });
  }

  function startRectangle(x: number, y: number) {
    rectStart.current = { x, y };
    drawingRect.current = { x, y, width: 0, height: 0 };
  }

  function updateRectangle(x: number, y: number) {
    drawingRect.current = {
      x: rectStart.current.x,
      y: rectStart.current.y,
      width: x - rectStart.current.x,
      height: y - rectStart.current.y,
    };
  }

  function finishRectangle() {
    const rectangle = drawingRect.current;
    if (!rectangle) return;

    drawingRect.current = null;

    if (rectangle.width === 0 || rectangle.height === 0) return;

    addDrawing({
      id: crypto.randomUUID(),
      type: "rectangle",
      rectangle,
    });
  }

  function startBrush(x: number, y: number) {
    drawingBrush.current = [{ x, y }];
  }

  function updateBrush(x: number, y: number) {
    drawingBrush.current.push({ x, y });
  }

  function finishBrush() {
    const points = drawingBrush.current;

    drawingBrush.current = [];

    if (points.length === 0) return;

    addDrawing({
      id: crypto.randomUUID(),
      type: "brush",
      points,
    });
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

    deleteDrawing,
  };
}
