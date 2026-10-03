"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard/admin" },
  { name: "Applications", href: "/dashboard/admin/applications" },
  { name: "Trainers", href: "/dashboard/admin/trainers" },
  { name: "Payments", href: "/dashboard/admin/payments" },
  { name: "Students", href: "/dashboard/admin/students" },
];

export function DesktopNav() {
  const pathname = usePathname();
  
  return (
    <div className="mt-3 space-y-1">
      {navItems.map((item) => {
        // This is the exact logic that checks if the current URL matches the button
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 ${
              isActive
                ? "bg-[#F0F5FA] text-[#1D5FA7]" // The blue active highlight
                : "text-[#5B6474] hover:bg-[#F7F9FC] hover:text-[#172033]"
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
    <nav className="flex gap-2 overflow-x-auto border-t border-[#E2E8F0] px-4 py-3 lg:hidden [&::-webkit-scrollbar]:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[#F0F5FA] text-[#1D5FA7]" // The blue active highlight for mobile
                : "text-[#5B6474] hover:bg-[#F7F9FC]"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}