import { Minus, Plus } from "lucide-react";
import { zoomIn, zoomOut } from "../lib/zoom";

type ZoomControlsProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-6 p-3 rounded-xl bg-surface border border-border text-text font-golos text-lg">
      <button onClick={() => onZoomChange(zoomOut(zoom))}>
        <Minus />
      </button>
      <span className="block w-14 tabular-nums text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button onClick={() => onZoomChange(zoomIn(zoom))}>
        <Plus />
      </button>
    </div>
  );
}

export default ZoomControls;
