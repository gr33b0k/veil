export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Drawing =
  | {
      type: "rectangle";
      rectangle: Rectangle;
    }
  | {
      type: "brush";
      points: Point[];
    };
