type Viewport = {
  zoom: number;
  x: number;
  y: number;
};

type DrawCanvasProps = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  viewport: Viewport;
};

export function drawCanvas({ canvas, image, viewport }: DrawCanvasProps) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const padding = 40;

  const scale = Math.min(
    (rect.width - padding * 2) / image.naturalWidth,
    (rect.height - padding * 2) / image.naturalHeight,
  );

  const width = image.naturalWidth * scale * viewport.zoom;
  const height = image.naturalHeight * scale * viewport.zoom;

  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.drawImage(image, viewport.x, viewport.y, width, height);
}
