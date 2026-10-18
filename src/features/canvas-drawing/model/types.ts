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

export type CensorType = "blur" | "solid";

export type Drawing =
  | {
      id: string;
      type: "rectangle";
      rectangle: Rectangle;
      blurIntensity: number;
      censorType: CensorType;
    }
  | {
      id: string;
      type: "brush";
      points: Point[];
      size: number;
      blurIntensity: number;
      censorType: CensorType;
    };
