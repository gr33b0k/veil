import { Logo } from "@/shared";

type HeaderProps = {
  mode: "landing" | "editor";
};

function Header({ mode }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between h-16 ${mode === "editor" ? "absolute w-[calc(100%-48px) top-8 left-6 z-1" : "w-full px-6 p-8 relative"}`}
    >
      <div
        className={`${mode === "editor" ? "bg-surface border-2 border-border rounded-xl px-4 py-2" : ""}`}
      >
        <Logo />
      </div>
    </header>
  );
}

export default Header;
