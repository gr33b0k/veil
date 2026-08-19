import { useCanvasViewport } from "@/features";
import { useRef } from "react";
import Toolbar from "./Toolbar";

type ImageViewerProps = {
  image: File;
};

function ImageEditor({ image }: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    zoom,
    isPanning,
    handleZoomChange,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleFit,
  } = useCanvasViewport({
    canvasRef,
    image,
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full object-contain bg-checker rounded-xl ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <Toolbar zoom={zoom} onZoomChange={handleZoomChange} onFit={handleFit} />
    </>
  );
}

export default ImageEditor;
