import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { DesktopNav, MobileNav } from "./AdminNav";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) redirect("/login");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user || user.role !== "ADMIN") redirect("/dashboard");
    return user;
  } catch {
    redirect("/login");
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyAdmin();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-800 bg-[#0A192F] text-slate-300 lg:flex lg:flex-col shadow-xl">
        <div className="border-b border-slate-800 px-6 py-6 bg-[#071120]">
          <Link href="/" className="text-base font-bold tracking-wider uppercase text-white flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500 inline-block shadow-lg shadow-blue-500/50"></span>
            OUI Entrepreneurship
          </Link>
          <p className="mt-1 text-xs font-semibold text-blue-400 tracking-widest uppercase">Admin Control Center</p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
            Management Menu
          </p>
          <DesktopNav />
        </nav>

        <div className="border-t border-slate-800 p-4 bg-[#071120]">
          <form action={logout}>
            <button 
              type="submit" 
              className="flex w-full items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
            >
              Sign out of Portal
            </button>
          </form>
        </div>
      </aside>

      {/* Unified Dark Header (Desktop & Mobile) */}
      <header className="sticky top-0 z-20 bg-[#0A192F] border-b border-slate-800 lg:ml-72 shadow-md">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              OUI Portal
            </p>
            <h2 className="text-sm font-bold text-white">
              Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-slate-200">Admin Account</p>
              <p className="text-[10px] text-slate-400 font-medium">Programme Coordinator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white shadow-md shadow-blue-500/20">
              AD
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <main className="flex-1">
          {children}
        </main>

        {/* Mobile Logout (Un-fixed, sits cleanly at the bottom of the content) */}
        <div className="mt-8 p-5 lg:hidden border-t border-slate-200 bg-white">
          <form action={logout}>
            <button 
              type="submit" 
              className="flex w-full items-center justify-center rounded-xl bg-red-50 border border-red-100 px-4 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100 shadow-sm cursor-pointer"
            >
              Sign out of Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}