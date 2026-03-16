import Image from "next/image";

export default function Navbar() {
  return (
    <header className="flex items-center justify-center h-12">
      <Image src="/logo.svg" alt="Pawfeed Logo" width={108} height={24} />
    </header>
  );
}
