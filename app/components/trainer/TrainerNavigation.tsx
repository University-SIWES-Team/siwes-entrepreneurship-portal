"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

interface NavItem {
  name: string;
  href: string;
}

interface TrainerNavigationProps {
  navItems: NavItem[];
  trainerName: string;
  trainerSpecialty: string;
  initials: string;
}

export default function TrainerNavigation({ navItems, trainerName, trainerSpecialty, initials }: TrainerNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (Dark Theme) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F2747] text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6 text-center lg:text-left">
          <Link href="/" className="text-lg font-black tracking-tight text-white uppercase">
            OUI PORTAL
          </Link>
          <p className="mt-1 text-xs font-bold tracking-widest text-[#4A90E2] uppercase">
            Trainer Dashboard
          </p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
            Management Menu
          </p>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#1D5FA7] text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D5FA7] text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-white">{trainerName}</p>
              <p className="truncate text-xs text-white/60">{trainerSpecialty}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-white/5 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out of Portal
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header & Pill Nav (Dark Theme) */}
      <div className="sticky top-0 z-20 w-full bg-[#0F2747] text-white shadow-md lg:hidden">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-sm font-black tracking-tight text-white uppercase">
              OUI PORTAL
            </p>
            <p className="text-[10px] font-bold tracking-widest text-[#4A90E2] uppercase">
              Trainer Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D5FA7] text-xs font-bold text-white">
              {initials}
            </div>
            {/* RESTORED MOBILE LOGOUT FUNCTIONALITY */}
            <form action={logout}>
              <button 
                type="submit" 
                title="Sign Out"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Horizontal Scrolling Pill Navigation */}
        <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#1D5FA7] text-white shadow-sm"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}