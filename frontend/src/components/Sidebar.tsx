import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen shrink-0 border-r rounded-r border-stone-200 bg-yellow">
      
      <div className="flex h-full flex-col bg-white p-4 rounded-r">

        {/* Logo */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/velo.png"
              alt="VeloCET Logo"
              width={36}
              height={36}
              className="rounded-lg"
            />

            <h1 className="text-2xl font-bold">
              VeloWiki
            </h1>
          </div>

          <button className="rounded-lg p-2 hover:bg-stone-100">
            <Menu size={22} />
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-stone-200" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2">

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-stone-100"
          >
            <Image
              src="/icons/dasgboard.png"
              alt="Dashboard"
              width={20}
              height={20}
            />

            <span>Dashboard</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-stone-100"
          >
            <Image
              src="/icons/person.png"
              alt="Dashboard"
              width={20}
              height={20}
            />

            <span>People</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-stone-100"
          >
            <Image
              src="/icons/project.png"
              alt="Dashboard"
              width={20}
              height={20}
            />

            <span>Projects</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-stone-100"
          >
            <Image
              src="/icons/alumni.png"
              alt="Dashboard"
              width={20}
              height={20}
            />

            <span>Alumni</span>
          </Link>

          {/* <Link
            href="/admin"
            className="rounded-xl px-4 py-3 transition hover:bg-stone-100"
          >
            Admin
          </Link> */}

        </nav>

      </div>

    </aside>
  );
}