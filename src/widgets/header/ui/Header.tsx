import { Logo } from "@/shared";

function Header() {
  return (
    <header className="flex items-center border-b justify-between px-6 p-8 h-16 border-border">
      <Logo />
    </header>
  );
}

export default Header;
