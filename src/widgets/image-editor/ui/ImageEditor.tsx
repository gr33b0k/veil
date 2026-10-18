import {
  findDrawingAtPoint,
  getCanvasPoint,
  getImageScale,
  useCanvasDrawing,
  useCanvasViewport,
  type CensorType,
  type Tool,
} from "@/features";
import { useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "./Toolbar";
import { useCanvasRenderer } from "../model/useCanvasRenderer";
import { createBrushCursor } from "../lib/cursor";

type ImageEditorProps = {
  image: File;

  tool: Tool;
  setTool: (tool: Tool) => void;

  brushSize: number;
  blurIntensity: number;
  censorType: CensorType;
};

function ImageEditor({
  image,
  tool,
  setTool,
  brushSize,
  blurIntensity,
  censorType,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cacheCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const effectCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelateCanvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!tempCanvasRef.current) {
    tempCanvasRef.current = document.createElement("canvas");
  }

  if (!cacheCanvasRef.current) {
    cacheCanvasRef.current = document.createElement("canvas");
  }

  if (!effectCanvasRef.current) {
    effectCanvasRef.current = document.createElement("canvas");
  }

  if (!pixelateCanvasRef.current) {
    pixelateCanvasRef.current = document.createElement("canvas");
  }

  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null,
  );

  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!imageElement) return;

    const tempCanvas = tempCanvasRef.current;
    const cacheCanvas = cacheCanvasRef.current;
    const effectCanvas = effectCanvasRef.current;

    if (!tempCanvas || !cacheCanvas || !effectCanvas) return;

    cacheCanvas.width = imageElement.naturalWidth;
    cacheCanvas.height = imageElement.naturalHeight;

    tempCanvas.width = imageElement.naturalWidth;
    tempCanvas.height = imageElement.naturalHeight;

    effectCanvas.width = imageElement.naturalWidth;
    effectCanvas.height = imageElement.naturalHeight;
  }, [imageElement]);

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

  const { scheduleDraw } = useCanvasRenderer({
    canvasRef,
    tempCanvasRef,
    cacheCanvasRef,
    effectCanvasRef,
    pixelateCanvasRef,
    imageElement,
    viewport,
    drawings,
    selectedDrawingId,
    drawingRect,
    drawingBrush,
    brushSize,
    blurIntensity,
    censorType,
  });

  const rect = canvasRef.current?.getBoundingClientRect();

  const imageScale = rect
    ? getImageScale({
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        imageWidth: imageElement?.naturalWidth ?? 0,
        imageHeight: imageElement?.naturalHeight ?? 0,
      }) * viewport.zoom
    : 1;

  const cursor = useMemo(() => {
    if (tool === "cursor") return "default";
    if (tool === "rectangle") return "crosshair";

    return createBrushCursor(brushSize * imageScale);
  }, [tool, brushSize, imageScale]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedDrawingId) {
        if (e.key === "Delete") {
          deleteDrawing(selectedDrawingId);
          setSelectedDrawingId(null);
        }

        if (e.key === "Escape") {
          setSelectedDrawingId(null);
        }
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
        if (!drawingRect.current) return;

        updateRectangle(point.x, point.y);
        scheduleDraw();

        break;
      case "brush":
        if (drawingBrush.current.length === 0) return;

        updateBrush(point.x, point.y);
        scheduleDraw();

        break;
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (isPanning) {
      stopPan();
    } else {
      switch (tool) {
        case "rectangle":
          finishRectangle(blurIntensity, censorType);
          break;
        case "brush":
          finishBrush(brushSize, blurIntensity, censorType);
          break;
      }
    }

    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <section className="relative min-w-0 h-full flex-1">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-checker"
        style={{ cursor }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      />

      <Toolbar
        zoom={viewport.zoom}
        onZoomChange={handleZoomChange}
        onFit={handleFit}
        currentTool={tool}
        onToolChange={setTool}
      />
    </section>
  );
}

export default ImageEditor;
