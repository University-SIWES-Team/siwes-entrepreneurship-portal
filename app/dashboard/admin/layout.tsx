import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import LoadingButton from "@/app/components/LoadingButton";
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
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#E2E8F0] px-6 py-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-[#0F2747]">
            Entrepreneurship Portal
          </Link>
          <p className="mt-1 text-xs font-medium text-[#7A8494]">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A8494]">
            Menu
          </p>
          <DesktopNav />
        </nav>

        <div className="border-t border-[#E2E8F0] p-4">
          <form action={logout}>
            <LoadingButton loadingText="Signing out..." className="w-full">
              Sign out
            </LoadingButton>
          </form>
        </div>
      </aside>

      {/* Mobile Header & Nav */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur lg:ml-64">
        <div className="flex h-16 items-center justify-between border-b border-[#E2E8F0] px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0F2747]">
              Entrepreneurship Portal
            </p>
            <p className="hidden text-xs text-[#7A8494] sm:block">
              Admin Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#172033]">Admin Account</p>
              <p className="text-xs text-[#7A8494]">Programme Coordinator</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D5FA7] text-sm font-semibold text-white">
              A
            </div>
          </div>
        </div>
        <MobileNav />
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Logout (Pinned to bottom on mobile) */}
      <div className="fixed bottom-0 left-0 z-20 w-full border-t border-[#E2E8F0] bg-white p-4 lg:hidden">
        <form action={logout}>
          <LoadingButton loadingText="Signing out..." className="w-full">
            Sign out
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}