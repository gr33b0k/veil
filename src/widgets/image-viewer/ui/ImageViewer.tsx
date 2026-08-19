import { useEffect, useRef } from "react";

type ImageViewerProps = {
  image: File;
};

function ImageViewer({ image }: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const imgSrc = URL.createObjectURL(image);
    img.src = imgSrc;

    img.onload = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      const padding = 40;

      const availableWidth = canvasWidth - padding * 2;
      const availableHeight = canvasHeight - padding * 2;

      const scale = Math.min(
        availableWidth / img.naturalWidth,
        availableHeight / img.naturalHeight,
      );

      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;

      const x = (canvasWidth - width) / 2;
      const y = (canvasHeight - height) / 2;

      ctx.drawImage(img, x, y, width, height);

      URL.revokeObjectURL(imgSrc);
    };
  }, [image]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain bg-checker rounded-xl"
      />
    </>
  );
}

export default ImageViewer;
