import { ZoomControls, FitButton, ToolSelector, type Tool } from "@/features";

type ToolbarProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFit: () => void;

  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
};

function Toolbar({
  zoom,
  onZoomChange,
  onFit,
  currentTool,
  onToolChange,
}: ToolbarProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <ToolSelector currentTool={currentTool} onToolChange={onToolChange} />
      <ZoomControls zoom={zoom} onZoomChange={onZoomChange} />
      <FitButton onFit={onFit} />
    </div>
  );
}

export default Toolbar;
