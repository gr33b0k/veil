import type { Drawing, Point } from "@/features";
import { distanceToSegment } from "./distanceToSegment";

export function hitTest(drawing: Drawing, point: Point) {
  if (drawing.type === "rectangle") {
    const top = Math.min(
      drawing.rectangle.y,
      drawing.rectangle.y + drawing.rectangle.height,
    );
    const right = Math.max(
      drawing.rectangle.x,
      drawing.rectangle.width + drawing.rectangle.x,
    );
    const bottom = Math.max(
      drawing.rectangle.y,
      drawing.rectangle.y + drawing.rectangle.height,
    );
    const left = Math.min(
      drawing.rectangle.x,
      drawing.rectangle.width + drawing.rectangle.x,
    );

    return (
      point.x <= right && point.x >= left && point.y <= bottom && point.y >= top
    );
  }

  if (drawing.type === "brush") {
    for (let i = 1; i < drawing.points.length; i++) {
      const distance = distanceToSegment(
        point,
        drawing.points[i - 1],
        drawing.points[i],
      );

      if (distance <= 50) {
        return true;
      }
    }

    return false;
  }
}
