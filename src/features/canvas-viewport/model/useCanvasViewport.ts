import { useEffect, useRef, useState } from "react";
import { zoomAtPoint, zoomIn, zoomOut } from "../lib/zoom";
import type { Viewport } from "./types";
import { getImageScale } from "../lib/getImageScale";

type UseCanvasViewportProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  offscreenCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
};

export function useCanvasViewport({
  canvasRef,
  offscreenCanvasRef,
  image,
}: UseCanvasViewportProps) {
  const [viewport, setViewport] = useState<Viewport>({
    zoom: 1,
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] = useState(false);

  const panStart = useRef({
    x: 0,
    y: 0,
  });

  function startPan(x: number, y: number) {
    setIsPanning(true);

    panStart.current = {
      x,
      y,
    };
  }

  function movePan(x: number, y: number) {
    if (!isPanning) return;

    const dx = x - panStart.current.x;
    const dy = y - panStart.current.y;

    panStart.current = {
      x,
      y,
    };

    setViewport((current) => ({
      ...current,
      x: current.x + dx,
      y: current.y + dy,
    }));
  }

  function stopPan() {
    setIsPanning(false);
  }

  function handleZoomChange(zoom: number) {
    setViewport((current) => ({
      ...current,
      zoom,
    }));
  }

  function handleFit() {
    const canvas = canvasRef.current;

    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();

    const scale = getImageScale(
      rect.width,
      rect.height,
      image.naturalWidth,
      image.naturalHeight,
    );

    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;

    setViewport({
      zoom: 1,
      x: (rect.width - width) / 2,
      y: (rect.height - height) / 2,
    });
  }

  useEffect(() => {
    if (image) {
      handleFit();
    }
  }, [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offCanvas = offscreenCanvasRef.current;

    if (!canvas || !offCanvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
    });

    resizeObserver.observe(canvas);

    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      const rect = canvas!.getBoundingClientRect();

      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setViewport((current) => {
        const nextZoom =
          e.deltaY < 0 ? zoomIn(current.zoom) : zoomOut(current.zoom);

        const result = zoomAtPoint({
          zoom: current.zoom,
          x: current.x,
          y: current.y,
          cursorX,
          cursorY,
          nextZoom,
        });

        return {
          zoom: result.zoom,
          x: result.offsetX,
          y: result.offsetY,
        };
      });
    }

    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
    };
  }, []);

  return {
    viewport,
    startPan,
    movePan,
    stopPan,
    handleZoomChange,
    handleFit,
  };
}
