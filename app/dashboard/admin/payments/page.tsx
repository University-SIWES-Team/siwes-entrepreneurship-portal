import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
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

export default async function AdminPaymentsPage() {
  await getAdmin();

  const payments = await prisma.payment.findMany({
    include: {
      application: {
        include: { student: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalPaid = payments.filter((p) => p.status === "PAID").length;
  const totalPending = payments.filter((p) => p.status === "PENDING").length;

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#E2E8F0] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">Administration</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
            Payments Ledger
          </h1>
          <p className="mt-3 text-sm text-[#5B6474] sm:text-base">
            Track and cross-reference student fee transactions.
          </p>
        </div>

       {/* Notice the grid-cols-2 for mobile! */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3">
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-medium text-[#7A8494] sm:text-sm">Total</p>
              <p className="mt-1 text-2xl font-bold text-[#0F2747] sm:text-3xl">{payments.length}</p>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm transition hover:shadow-md">
              <p className="text-xs font-medium text-[#7A8494] sm:text-sm">Verified</p>
              <p className="mt-1 text-2xl font-bold text-[#1D5FA7] sm:text-3xl">{totalPaid}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:col-span-1">
              <p className="text-xs font-medium text-[#7A8494] sm:text-sm">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-[#D4A72C] sm:text-3xl">{totalPending}</p>
            </div>
          </section>

        <div className="mt-8 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] bg-[#F7F9FC] px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#172033]">
              Transaction History
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#7A8494]">
              No payment records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-[#172033] sm:px-6">Student</th>
                      <th className="px-4 py-4 text-sm font-semibold text-[#172033] sm:px-6">Payment Type</th>
                      <th className="px-4 py-4 text-sm font-semibold text-[#172033] sm:px-6">Reference ID</th>
                      <th className="px-4 py-4 text-sm font-semibold text-[#172033] sm:px-6">Status</th>
                      <th className="px-4 py-4 text-sm font-semibold text-[#172033] sm:px-6">Date</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#F7F9FC] transition">
                      <td className="px-6 py-4 font-semibold text-[#172033]">
                        {payment.application.student.fullName}
                        <span className="block text-xs font-normal text-[#7A8494]">
                          {payment.application.student.matricNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#5B6474]">
                        {payment.type.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#5B6474]">
                        {payment.providerRef || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                          payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#5B6474]">
                        {payment.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}