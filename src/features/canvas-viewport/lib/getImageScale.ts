export function getImageScale(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
) {
  const padding = 40;

  return Math.min(
    (canvasWidth - padding * 2) / imageWidth,
    (canvasHeight - padding * 2) / imageHeight,
  );
}
