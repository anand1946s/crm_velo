"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  FolderGit2, 
  GraduationCap, 
  Settings,
  Menu,
  LogOut
} from "lucide-react";

interface SidebarProps {
  onToggle?: () => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type");
  const { data: session } = useSession();

  // Helper to determine if link is active
  const isActive = (href: string, isAlumni = false) => {
    if (isAlumni) {
      return pathname === "/persons" && activeType === "ALUMNI";
    }
    if (href === "/persons") {
      return pathname === "/persons" && activeType !== "ALUMNI";
    }
    return pathname === href;
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "People",
      href: "/persons",
      icon: Users,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderGit2,
    },
    {
      name: "Alumni",
      href: "/persons?type=ALUMNI",
      icon: GraduationCap,
      isAlumni: true,
    },
    {
      name: "Admin",
      href: "/admin",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-72 h-full shrink-0">
      <div className="flex h-full flex-col bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
              <Image
                src="/icons/velo.png"
                alt="VeloCET Logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                VeloWiki
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">CRM Platform</p>
            </div>
          </div>

          <button 
            onClick={onToggle}
            className="rounded-xl p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-slate-100" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1.5">
          {navItems
            .filter((item) => item.name !== "Admin" || (session?.user as any)?.role === "admin")
            .map((item) => {
              const active = isActive(item.href, item.isAlumni);
              const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-2">
          {session ? (
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              {session.user?.image ? (
                <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm shrink-0">
                  {session.user?.name ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "VC"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{session.user?.name || "Velo User"}</p>
                <p className="text-[10px] text-slate-500 truncate">{session.user?.email || ""}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm shrink-0">
                VC
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">Not Signed In</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}