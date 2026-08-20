import { useCanvasViewport, type Tool } from "@/features";
import { useRef, useState } from "react";
import Toolbar from "./Toolbar";

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

  const { zoom, startPan, movePan, stopPan, handleZoomChange, handleFit } =
    useCanvasViewport({
      canvasRef,
      image,
    });

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "cursor") {
      if (e.button === 2) return;
      startPan(e.clientX, e.clientY);

      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "cursor") {
      movePan(e.clientX, e.clientY);
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "cursor") {
      stopPan();
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
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onFit={handleFit}
        currentTool={tool}
        onToolChange={setTool}
      />
    </>
  );
}

export default ImageEditor;
