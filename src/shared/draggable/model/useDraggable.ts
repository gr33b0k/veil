import { useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
};

export function useDraggable(initialPosition: Position) {
  const [position, setPosition] = useState(initialPosition);

  const offsetRef = useRef({
    x: 0,
    y: 0,
  });

  function onPointerDown(e: React.PointerEvent<HTMLElement>) {
    if (
      e.target instanceof Element &&
      (e.target.closest("button") || !e.target.closest("header"))
    )
      return;

    e.currentTarget.setPointerCapture(e.pointerId);

    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    setPosition({
      x: Math.max(
        0,
        Math.min(
          e.clientX - offsetRef.current.x,
          window.innerWidth - e.currentTarget.offsetWidth,
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          e.clientY - offsetRef.current.y,
          window.innerHeight - e.currentTarget.offsetHeight,
        ),
      ),
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return {
    position,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
