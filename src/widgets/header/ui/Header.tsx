import { ExportButton } from "@/features";
import { Logo } from "@/shared";

type HeaderProps = {
  mode: "landing" | "editor";
  onExport: () => void;
};

function Header({ mode, onExport }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between h-16 pointer-events-none ${mode === "editor" ? "absolute top-4 left-4 right-4 z-1" : "w-full px-4 relative"}`}
    >
      <div
        className={`${mode === "editor" ? "bg-surface border-2 border-border rounded-xl px-4 py-2" : ""}`}
      >
        <Logo />
      </div>
      {mode === "editor" && <ExportButton onExport={onExport} />}
    </header>
  );
}

export default Header;
