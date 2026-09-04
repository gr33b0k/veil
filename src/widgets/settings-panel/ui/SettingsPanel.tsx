import { Slider } from "@/shared";
import { Brush } from "lucide-react";

type SettingsPanelProps = {
  brushSize: number;
  onBrushSizeChange: (brushSize: number) => void;

  blurIntensity: number;
  onBlurIntensityChange: (blur: number) => void;
};

function SettingsPanel({
  brushSize,
  onBrushSizeChange,
  blurIntensity,
  onBlurIntensityChange,
}: SettingsPanelProps) {
  return (
    <aside className="absolute right-6 top-1/2 z-10 w-80 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-elevated shadow-2xl">
      <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Brush size={20} />
        </div>

        <div>
          <h2 className="font-golos text-xl font-medium text-text">Brush</h2>

          <p className="text-sm text-text-muted">Configure brush settings</p>
        </div>
      </header>

      <div className="flex flex-col *:p-5 divide-y divide-border">
        <Slider
          title="Blur intensity"
          units="px"
          value={blurIntensity}
          onChange={onBlurIntensityChange}
          min={0}
          max={200}
          name="brush-size"
        />
        <Slider
          title="Brush size"
          units="px"
          value={brushSize}
          onChange={onBrushSizeChange}
          min={0}
          max={200}
          name="brush-size"
        />
      </div>
    </aside>
  );
}

export default SettingsPanel;
