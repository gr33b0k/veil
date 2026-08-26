import type { Drawing, Point } from "@/features";
import { hitTest } from "./hitTest";

export function findDrawingAtPoint(drawings: Drawing[], point: Point) {
  return drawings.findLast((drawing) => hitTest(drawing, point));
}
