import { useEffect, useRef, useState } from "react";
import { zoomAtPoint, zoomIn, zoomOut } from "../lib/zoom";

type UseCanvasViewportProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  image: File;
};

export function useCanvasViewport({
  canvasRef,
  image,
}: UseCanvasViewportProps) {
  const [viewport, setViewport] = useState({
    zoom: 1,
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const panStart = useRef({
    x: 0,
    y: 0,
  });

  function draw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = 40;

    const scale = Math.min(
      (rect.width - padding * 2) / img.naturalWidth,
      (rect.height - padding * 2) / img.naturalHeight,
    );

    const width = img.naturalWidth * scale * viewport.zoom;
    const height = img.naturalHeight * scale * viewport.zoom;

    ctx.drawImage(img, viewport.x, viewport.y, width, height);
  }

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

  useEffect(() => {
    const img = new Image();
    const src = URL.createObjectURL(image);

    img.src = src;

    img.onload = () => {
      imgRef.current = img;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const padding = 40;

      const scale = Math.min(
        (rect.width - padding * 2) / img.naturalWidth,
        (rect.height - padding * 2) / img.naturalHeight,
      );

      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;

      setViewport({
        zoom: 1,
        x: (rect.width - width) / 2,
        y: (rect.height - height) / 2,
      });
    };

    return () => {
      URL.revokeObjectURL(src);
      imgRef.current = null;
    };
  }, [image]);

  useEffect(() => {
    draw();
  }, [viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    };
  }, []);

  function handleZoomChange(zoom: number) {
    setViewport((current) => ({
      ...current,
      zoom,
    }));
  }

  function handleFit() {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!canvas || !img) return;

    const rect = canvas.getBoundingClientRect();

    const padding = 40;

    const scale = Math.min(
      (rect.width - padding * 2) / img.naturalWidth,
      (rect.height - padding * 2) / img.naturalHeight,
    );

    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;

    setViewport({
      zoom: 1,
      x: (rect.width - width) / 2,
      y: (rect.height - height) / 2,
    });
  }

  return {
    zoom: viewport.zoom,
    startPan,
    movePan,
    stopPan,
    handleZoomChange,
    handleFit,
  };
}
