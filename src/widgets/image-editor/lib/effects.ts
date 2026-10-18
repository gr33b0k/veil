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
