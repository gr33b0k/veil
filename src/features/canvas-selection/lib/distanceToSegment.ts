import type { Point } from "@/features";

export function distanceToSegment(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) /
        (dx * dx + dy * dy),
    ),
  );

  const closestX = start.x + t * dx;
  const closestY = start.y + t * dy;

  return Math.hypot(point.x - closestX, point.y - closestY);
}
