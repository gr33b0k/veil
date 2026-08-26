import {
  findDrawingAtPoint,
  getCanvasPoint,
  useCanvasDrawing,
  useCanvasViewport,
  type Tool,
} from "@/features";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import { drawCanvas } from "../lib/drawCanvas";

type ImageViewerProps = {
  image: File;
};

const cursors: Record<Tool, string> = {
  cursor: "cursor-default",
  rectangle: "cursor-crosshair",
  brush: "cursor-cell",
};

function ImageEditor({ image }: ImageViewerProps) {
  const [tool, setTool] = useState<Tool>("cursor");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!offscreenCanvasRef.current) {
    offscreenCanvasRef.current = document.createElement("canvas");
  }

  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null,
  );

  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const img = new Image();

    const src = URL.createObjectURL(image);

    img.src = src;

    img.onload = () => {
      setImageElement(img);
    };

    return () => {
      URL.revokeObjectURL(src);
    };
  }, [image]);

  const {
    viewport,
    isPanning,
    startPan,
    movePan,
    stopPan,
    handleZoomChange,
    handleFit,
  } = useCanvasViewport({
    canvasRef,
    offscreenCanvasRef,
    image: imageElement,
  });

  const {
    drawings,
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
  } = useCanvasDrawing();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Delete" && selectedDrawingId) {
        deleteDrawing(selectedDrawingId);
        setSelectedDrawingId(null);
      }

      const modifier = e.ctrlKey || e.metaKey;

      if (!modifier) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }

      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDrawingId]);

  useEffect(() => {
    console.log(drawings);
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
      drawingRect,
      drawingBrush,
    });
  }, [
    imageElement,
    viewport,
    drawings,
    selectedDrawingId,
    drawingRect,
    drawingBrush,
  ]);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageElement || e.button === 2) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    if (e.button === 1) {
      startPan(e.clientX, e.clientY);
      return;
    }

    const point = getCanvasPoint({
      x: e.clientX,
      y: e.clientY,
      canvas: e.currentTarget,
      viewport,
      imageWidth: imageElement.naturalWidth,
      imageHeight: imageElement.naturalHeight,
    });

    switch (tool) {
      case "cursor":
        const selectedDrawing = findDrawingAtPoint(drawings, point);
        setSelectedDrawingId(selectedDrawing?.id ?? null);
        break;
      case "rectangle":
        startRectangle(point.x, point.y);
        break;
      case "brush":
        startBrush(point.x, point.y);
        break;
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageElement) return;

    if (isPanning) {
      movePan(e.clientX, e.clientY);
      return;
    }

    const point = getCanvasPoint({
      x: e.clientX,
      y: e.clientY,
      canvas: e.currentTarget,
      viewport,
      imageWidth: imageElement.naturalWidth,
      imageHeight: imageElement.naturalHeight,
    });

    switch (tool) {
      case "rectangle":
        if (!drawingRect) return;

        updateRectangle(point.x, point.y);

        break;
      case "brush":
        if (drawingBrush.length === 0) return;

        updateBrush(point.x, point.y);

        break;
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (isPanning) {
      stopPan();
    } else {
      switch (tool) {
        case "rectangle":
          finishRectangle();
          break;
        case "brush":
          finishBrush();
          break;
      }
    }

    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain bg-checker rounded-xl ${
          cursors[tool]
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <Toolbar
        zoom={viewport.zoom}
        onZoomChange={handleZoomChange}
        onFit={handleFit}
        currentTool={tool}
        onToolChange={setTool}
      />
    </>
  );
}

export default ImageEditor;
