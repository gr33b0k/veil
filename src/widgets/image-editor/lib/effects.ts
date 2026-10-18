export function applyBlur(
  source: HTMLCanvasElement,
  mask: HTMLCanvasElement,
  result: HTMLCanvasElement,
  intensity: number,
) {
  const resultCtx = result.getContext("2d");
  if (!resultCtx) return;

  resultCtx.clearRect(0, 0, result.width, result.height);

  resultCtx.save();
  resultCtx.filter = `blur(${intensity}px)`;
  resultCtx.drawImage(source, 0, 0);

  resultCtx.filter = "none";
  resultCtx.globalCompositeOperation = "destination-in";
  resultCtx.drawImage(mask, 0, 0);
  resultCtx.restore();
}

export function applyPixelization(
  source: HTMLCanvasElement,
  mask: HTMLCanvasElement,
  result: HTMLCanvasElement,
  pixelateCanvas: HTMLCanvasElement,
  pixelSize: number,
) {
  const resultCtx = result.getContext("2d");
  const pixelateCtx = pixelateCanvas.getContext("2d");

  if (!resultCtx || !pixelateCtx) return;

  const width = source.width;
  const height = source.height;
  const size = Math.max(1, Math.round(pixelSize));

  pixelateCanvas.width = Math.max(1, Math.ceil(width / size));
  pixelateCanvas.height = Math.max(1, Math.ceil(height / size));

  pixelateCtx.drawImage(
    source,
    0,
    0,
    pixelateCanvas.width,
    pixelateCanvas.height,
  );

  resultCtx.clearRect(0, 0, result.width, result.height);
  resultCtx.save();
  resultCtx.globalCompositeOperation = "source-over";
  resultCtx.imageSmoothingEnabled = false;
  resultCtx.drawImage(
    pixelateCanvas,
    0,
    0,
    pixelateCanvas.width,
    pixelateCanvas.height,
    0,
    0,
    width,
    height,
  );

  resultCtx.globalCompositeOperation = "destination-in";
  resultCtx.drawImage(mask, 0, 0);
  resultCtx.restore();
}
