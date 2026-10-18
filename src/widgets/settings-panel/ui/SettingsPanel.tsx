import type { Tool } from "@/features";
import type { CensorType } from "@/features/canvas-drawing";
import { Slider, useDraggable } from "@/shared";
import { Brush, PinIcon, PinOffIcon, Square } from "lucide-react";
import { useState } from "react";

type SettingsPanelProps = {
  tool: Tool;

  brushSize: number;
  onBrushSizeChange: (brushSize: number) => void;

  blurIntensity: number;
  onBlurIntensityChange: (blur: number) => void;

  censorType: CensorType;
  onCensorTypeChange: (censorType: CensorType) => void;
};

function SettingsPanel({
  tool,
  brushSize,
  onBrushSizeChange,
  blurIntensity,
  onBlurIntensityChange,
  censorType,
  onCensorTypeChange,
}: SettingsPanelProps) {
  const [isPinned, setIsPinned] = useState(true);
  const { position, ...dragHandlers } = useDraggable({ x: 24, y: 100 });

  return (
    <aside
      className={`absolute z-10 w-80 overflow-hidden rounded-2xl border-2 border-border bg-elevated shadow-2xl ${tool === "cursor" ? "hidden" : ""}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      {...(!isPinned && dragHandlers)}
    >
      <header
        className={`flex items-center justify-between border-b border-border bg-surface px-5 py-4 ${!isPinned ? "cursor-move select-none" : "cursor-default"}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            {tool === "brush" ? <Brush size={20} /> : <Square size={20} />}
          </div>

          <div>
            <h2 className="font-golos text-xl font-medium text-text capitalize">
              {tool}
            </h2>

            <p className="text-sm text-text-muted">Configure {tool} settings</p>
          </div>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl bg-bg text-accent cursor-pointer hover:bg-accent/10"
          onClick={() => setIsPinned((prev) => !prev)}
        >
          {isPinned ? <PinOffIcon size={20} /> : <PinIcon size={20} />}
        </button>
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label htmlFor="brush-size" className="font-medium text-text">
              Censor type
            </label>
          </div>
          <div className="flex gap-2">
            <button
              className={`flex-1 text-center py-1 px-3 rounded-lg text-text cursor-pointer ${censorType === "blur" ? "bg-accent" : "bg-bg hover:bg-accent/20"}`}
              onClick={() => onCensorTypeChange("blur")}
            >
              Blur
            </button>
            <button
              className={`flex-1 text-center py-1 px-3 rounded-lg text-text cursor-pointer ${censorType === "pixelate" ? "bg-accent" : "bg-bg hover:bg-accent/20"}`}
              onClick={() => onCensorTypeChange("pixelate")}
            >
              Pixelate
            </button>
            <button
              className={`flex-1 text-center py-1 px-3 rounded-lg text-text cursor-pointer ${censorType === "solid" ? "bg-accent" : "bg-bg hover:bg-accent/20"}`}
              onClick={() => onCensorTypeChange("solid")}
            >
              Solid Fill
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SettingsPanel;
