"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard/admin" },
  { name: "Applications", href: "/dashboard/admin/applications" },
  { name: "Trainers", href: "/dashboard/admin/trainers" },
  { name: "Payments", href: "/dashboard/admin/payments" },
  { name: "Students", href: "/dashboard/admin/students" },
  { name: "Results & Grades", href: "/dashboard/admin/results" },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="mt-3 space-y-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-linear-to-r from-[#1D5FA7] to-[#144982] text-white shadow-md shadow-blue-500/20 font-semibold"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-t border-slate-800 bg-[#071120] px-4 py-3 lg:hidden scrollbar-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition ${
              isActive
                ? "bg-linear-to-r from-[#1D5FA7] to-[#144982] text-white shadow-md font-semibold"
                : "text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}