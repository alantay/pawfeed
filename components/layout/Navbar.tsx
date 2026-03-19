import { LayoutDashboardIcon, PawPrint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="p-6 bg-off-white border ">
      <nav className="max-w-4xl mx-auto flex items-center justify-center ">
        <Link href={"/"} className="flex-1">
          <Image src="/logo.svg" alt="Pawfeed Logo" width={108} height={24} />
        </Link>
        <div>
          <ul className="flex gap-9 font-semibold">
            <li>
              <Link href="/boarding/create" className="flex gap-1">
                <PawPrint className="w-4" />
                Create Boarding
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="flex gap-1">
                <LayoutDashboardIcon className="w-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
