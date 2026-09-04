type SliderProps = {
  title: string;
  units: string;

  value: number;
  onChange: (value: number) => void;

  min: number;
  max: number;
  step?: number;

  disabled?: boolean;
  name: string;
};

function Slider({
  title,
  units,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  name,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label htmlFor="brush-size" className="font-medium text-text">
          {title}
        </label>

        <span className="rounded-md bg-surface px-2.5 py-1 text-sm text-text-muted">
          {value} {units}
        </span>
      </div>

      <input
        className="w-full cursor-pointer accent-accent"
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        name={name}
        id={name}
      />

      <div className="flex justify-between text-xs text-text-muted">
        <span>
          {min} {units}
        </span>
        <span>
          {max} {units}
        </span>
      </div>
    </div>
  );
}

export default Slider;
