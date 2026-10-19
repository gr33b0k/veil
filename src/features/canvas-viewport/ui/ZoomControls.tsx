import { Minus, Plus } from "lucide-react";
import { zoomIn, zoomOut } from "../lib/zoom";

type ZoomControlsProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl overflow-hidden bg-surface border border-border text-text font-golos text-lg">
      <button
        className="p-3 cursor-pointer transition-colors duration-300 hover:bg-elevated"
        onClick={() => onZoomChange(zoomOut(zoom))}
      >
        <Minus />
      </button>
      <span className="block w-14 tabular-nums text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button
        className="p-3 cursor-pointer transition-colors duration-300 hover:bg-elevated"
        onClick={() => onZoomChange(zoomIn(zoom))}
      >
        <Plus />
      </button>
    </div>
  );
}

export default ZoomControls;
