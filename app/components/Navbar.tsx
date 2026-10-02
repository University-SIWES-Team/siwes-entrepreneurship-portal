"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0F2747]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          OUI Entrepreneurship Portal
        </Link>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-0 top-16 w-full flex-col gap-4 bg-[#0F2747] p-6 sm:static sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-6 sm:p-0`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/90 transition-colors hover:text-[#D4A72C]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-white/90 transition-colors hover:text-[#D4A72C]"
          >
            Log In
          </Link>

          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="rounded bg-white px-4 py-2 text-sm font-semibold text-[#0F2747] transition-colors hover:bg-[#D4A72C] hover:text-white"
          >
            Register
          </Link>
        </div>

        <button
          className="text-2xl text-white sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}