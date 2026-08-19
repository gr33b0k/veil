type ZoomAtPointParameters = {
  zoom: number;
  x: number;
  y: number;
  cursorX: number;
  cursorY: number;
  nextZoom: number;
};

export function zoomIn(zoom: number): number {
  return Math.min(zoom * 1.1, 10);
}

export function zoomOut(zoom: number): number {
  return Math.max(zoom / 1.1, 0.1);
}

export function zoomAtPoint({
  zoom,
  x,
  y,
  cursorX,
  cursorY,
  nextZoom,
}: ZoomAtPointParameters) {
  const scale = nextZoom / zoom;

  return {
    zoom: nextZoom,
    offsetX: cursorX - (cursorX - x) * scale,
    offsetY: cursorY - (cursorY - y) * scale,
  };
}
