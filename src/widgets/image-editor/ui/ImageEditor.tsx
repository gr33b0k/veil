import {
  getImageScale,
  screenToImage,
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

  const { viewport, startPan, movePan, stopPan, handleZoomChange, handleFit } =
    useCanvasViewport({
      canvasRef,
      offscreenCanvasRef,
      image: imageElement,
    });

  const {
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
  } = useCanvasDrawing();

  useEffect(() => {
    if (!imageElement) return;

    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;

    if (!canvas || !offscreenCanvas) return;

    drawCanvas({
      canvas,
      offscreenCanvas,
      image: imageElement,
      viewport,
      rectangles,
      drawingRectangle,
      brushStrokes,
      drawingBrush,
    });
  }, [
    imageElement,
    viewport,
    rectangles,
    drawingRectangle,
    brushStrokes,
    drawingBrush,
  ]);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageElement) return;

    if (tool === "cursor") {
      if (e.button === 2) return;
      startPan(e.clientX, e.clientY);

      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (tool === "rectangle") {
      if (e.button !== 0) return;

      const rect = e.currentTarget.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const scale = getImageScale(
        rect.width,
        rect.height,
        imageElement.naturalWidth,
        imageElement.naturalHeight,
      );

      const point = screenToImage({
        x: canvasX,
        y: canvasY,
        viewport,
        scale,
        imageWidth: imageElement.naturalWidth,
        imageHeight: imageElement.naturalHeight,
      });

      startRectangle(point.x, point.y);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (tool === "brush") {
      if (e.button !== 0) return;

      const rect = e.currentTarget.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const scale = getImageScale(
        rect.width,
        rect.height,
        imageElement.naturalWidth,
        imageElement.naturalHeight,
      );

      const point = screenToImage({
        x: canvasX,
        y: canvasY,
        viewport,
        scale,
        imageWidth: imageElement.naturalWidth,
        imageHeight: imageElement.naturalHeight,
      });

      startBrush(point.x, point.y);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageElement) return;

    if (tool === "cursor") {
      movePan(e.clientX, e.clientY);
    }

    if (tool === "rectangle") {
      if (!drawingRectangle) return;

      const rect = e.currentTarget.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const scale = getImageScale(
        rect.width,
        rect.height,
        imageElement.naturalWidth,
        imageElement.naturalHeight,
      );

      const point = screenToImage({
        x: canvasX,
        y: canvasY,
        viewport,
        scale,
        imageWidth: imageElement.naturalWidth,
        imageHeight: imageElement.naturalHeight,
      });

      updateRectangle(point.x, point.y);
    }

    if (tool === "brush") {
      if (drawingBrush.length === 0) return;

      const rect = e.currentTarget.getBoundingClientRect();

      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      const scale = getImageScale(
        rect.width,
        rect.height,
        imageElement.naturalWidth,
        imageElement.naturalHeight,
      );

      const point = screenToImage({
        x: canvasX,
        y: canvasY,
        viewport,
        scale,
        imageWidth: imageElement.naturalWidth,
        imageHeight: imageElement.naturalHeight,
      });

      updateBrush(point.x, point.y);
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "cursor") {
      stopPan();
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (tool === "rectangle") {
      finishRectangle();
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (tool === "brush") {
      finishBrush();
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
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
