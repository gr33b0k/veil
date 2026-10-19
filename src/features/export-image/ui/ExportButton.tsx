import { Download } from "lucide-react";

type ExportButtonProps = {
  onExport: () => void;
};

function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white transition-colors hover:bg-accent/90 cursor-pointer pointer-events-auto"
      onClick={onExport}
    >
      <Download size={20} />
      Export
    </button>
  );
}

export default ExportButton;
