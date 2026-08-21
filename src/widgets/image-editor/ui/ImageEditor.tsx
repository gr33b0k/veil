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
      image: imageElement,
    });

  const {
    rectangles,
    drawingRectangle,
    startRectangle,
    updateRectangle,
    finishRectangle,
  } = useCanvasDrawing();

  useEffect(() => {
    if (!imageElement) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    drawCanvas({
      canvas,
      image: imageElement,
      viewport,
      rectangles,
      drawingRectangle,
    });
  }, [imageElement, viewport, rectangles, drawingRectangle]);

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
