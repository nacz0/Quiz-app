import Link from "next/link";
import { LogoIcon } from "~/svg/logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 flex h-[4.5rem] w-full justify-between    bg-teal-300">
      <Link href={"/"} className="ml-1 flex items-center justify-center">
        <LogoIcon />
      </Link>
    </nav>
  );
}
