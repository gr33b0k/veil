import { Logo } from "@/shared";

function Header() {
  return (
    <header className="flex items-center bg-surface border-2 rounded-xl justify-between p-4 border-border">
      <Logo />
    </header>
  );
}

export default Header;
