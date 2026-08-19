import { ZoomControls, FitButton } from "@/features";

type ToolbarProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFit: () => void;
};

function Toolbar({ zoom, onZoomChange, onFit }: ToolbarProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      <ZoomControls zoom={zoom} onZoomChange={onZoomChange} />
      <FitButton onFit={onFit} />
    </div>
  );
}

export default Toolbar;
