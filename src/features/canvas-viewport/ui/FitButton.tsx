import { ExpandIcon } from "lucide-react";

type FitButtonProps = { onFit: () => void };

function FitButton({ onFit }: FitButtonProps) {
  return (
    <button
      className="p-3 rounded-xl bg-surface border border-border text-text"
      onClick={onFit}
    >
      <ExpandIcon />
    </button>
  );
}

export default FitButton;
