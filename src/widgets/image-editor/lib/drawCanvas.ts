import { getImageScale, type Rectangle, type Viewport } from "@/features";

type DrawCanvasProps = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  viewport: Viewport;

  rectangles: Rectangle[];
  drawingRectangle: Rectangle | null;
};

export function drawCanvas({
  canvas,
  image,
  viewport,
  rectangles,
  drawingRectangle,
}: DrawCanvasProps) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const scale = getImageScale(
    rect.width,
    rect.height,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.save();

  ctx.translate(viewport.x, viewport.y);
  ctx.scale(scale * viewport.zoom, scale * viewport.zoom);

  ctx.drawImage(image, 0, 0);

  function blurRectangle(rect: Rectangle) {
    if (!ctx) return;

    const { x, y, width, height } = rect;

    ctx.save();

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    ctx.filter = "blur(20px)";

    ctx.drawImage(image, 0, 0);

    ctx.restore();
  }

  rectangles.forEach(blurRectangle);

  if (drawingRectangle) {
    blurRectangle(drawingRectangle);
  }

  ctx.restore();
}
