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

export type CensorType = "blur" | "solid" | "pixelate";

export type Drawing =
  | {
      id: string;
      type: "rectangle";
      rectangle: Rectangle;
      effectIntensity: number;
      censorType: CensorType;
    }
  | {
      id: string;
      type: "brush";
      points: Point[];
      size: number;
      effectIntensity: number;
      censorType: CensorType;
    };
