import { useRef, useState } from "react";
import type { Point, Rectangle, Drawing, CensorType } from "./types";

export function useCanvasDrawing() {
  const [history, setHistory] = useState({
    past: [] as Drawing[][],
    present: [] as Drawing[],
    future: [] as Drawing[][],
  });

  const rectStart = useRef<Point>({ x: 0, y: 0 });
  const drawingRect = useRef<Rectangle | null>(null);
  const drawingBrush = useRef<Point[]>([]);

  function addDrawing(drawing: Drawing) {
    setHistory((current) => ({
      past: [...current.past, current.present],
      present: [...current.present, drawing],
      future: [],
    }));
  }

  function deleteDrawing(drawingId: string) {
    setHistory((current) => {
      const drawing = current.present.find(
        (drawing) => drawingId === drawing.id,
      );

      if (!drawing) return current;

      return {
        past: [...current.past, current.present],
        present: current.present.filter((drawing) => drawing.id !== drawingId),
        future: [],
      };
    });
  }

  function undo() {
    setHistory((current) => {
      if (current.past.length === 0) return current;

      return {
        past: current.past.slice(0, -1),
        present: current.past[current.past.length - 1],
        future: [...current.future, current.present],
      };
    });
  }

  function redo() {
    setHistory((current) => {
      if (current.future.length === 0) return current;

      return {
        past: [...current.past, current.present],
        present: current.future[current.future.length - 1],
        future: current.future.slice(0, -1),
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

  function finishRectangle(effectIntensity: number, censorType: CensorType) {
    const rectangle = drawingRect.current;
    if (!rectangle) return;

    drawingRect.current = null;

    if (rectangle.width === 0 || rectangle.height === 0) return;

    addDrawing({
      id: crypto.randomUUID(),
      type: "rectangle",
      rectangle,
      effectIntensity,
      censorType,
    });
  }

  function startBrush(x: number, y: number) {
    drawingBrush.current = [{ x, y }];
  }

  function updateBrush(x: number, y: number) {
    drawingBrush.current.push({ x, y });
  }

  function finishBrush(
    size: number,
    effectIntensity: number,
    censorType: CensorType,
  ) {
    const points = drawingBrush.current;

    drawingBrush.current = [];

    if (points.length === 0) return;

    addDrawing({
      id: crypto.randomUUID(),
      type: "brush",
      points,
      size,
      effectIntensity,
      censorType,
    });
  }

  return {
    drawings: history.present,
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
