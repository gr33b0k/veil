import type { Tool } from "@/features";
import { Slider, useDraggable } from "@/shared";
import { Brush, Square } from "lucide-react";

type SettingsPanelProps = {
  tool: Tool;

  brushSize: number;
  onBrushSizeChange: (brushSize: number) => void;

  blurIntensity: number;
  onBlurIntensityChange: (blur: number) => void;
};

function SettingsPanel({
  tool,
  brushSize,
  onBrushSizeChange,
  blurIntensity,
  onBlurIntensityChange,
}: SettingsPanelProps) {
  const { position, ...dragHandlers } = useDraggable({ x: 100, y: 100 });

  return (
    <aside
      className={`absolute z-10 w-80 overflow-hidden rounded-2xl border border-border bg-elevated shadow-2xl ${tool === "cursor" ? "hidden" : ""}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      {...dragHandlers}
    >
      <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4 cursor-move select-none">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {tool === "brush" ? <Brush size={20} /> : <Square size={20} />}
        </div>

        <div>
          <h2 className="font-golos text-xl font-medium text-text capitalize">
            {tool}
          </h2>

          <p className="text-sm text-text-muted">Configure {tool} settings</p>
        </div>
      </header>

      <div className="flex flex-col *:p-5 divide-y divide-border">
        {tool === "brush" && (
          <Slider
            title="Brush size"
            units="px"
            value={brushSize}
            onChange={onBrushSizeChange}
            min={0}
            max={200}
            name="brush-size"
          />
        )}
        <Slider
          title="Blur intensity"
          units=""
          value={blurIntensity}
          onChange={onBlurIntensityChange}
          min={1}
          max={10}
          name="brush-size"
        />
      </div>
    </aside>
  );
}

export default SettingsPanel;
