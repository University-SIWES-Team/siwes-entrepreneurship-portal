import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    totalApplications,
    pendingApplications,
    paidPayments,
    recentApplications,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: true, skill: true, payments: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="border-b border-[#E2E8F0] pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0F2747] sm:text-4xl">
          Admin Overview
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B6474] sm:text-base">
          Manage students, applications, payments, and programme activities.
        </p>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-[#0F2747]">{totalStudents}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Applications</p>
          <p className="mt-2 text-3xl font-bold text-[#0F2747]">{totalApplications}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Pending Applications</p>
          <p className="mt-2 text-3xl font-bold text-[#D4A72C]">{pendingApplications}</p>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-[#7A8494]">Paid Payments</p>
          <p className="mt-2 text-3xl font-bold text-[#1D5FA7]">{paidPayments}</p>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Applications
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#172033]">
              Recent Applications
            </h2>
          </div>
          <Link 
            href="/dashboard/admin/applications"
            className="hidden text-sm font-semibold text-[#1D5FA7] hover:text-[#0F2747] sm:block"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Skill</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Application</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Payment</th>
                <th className="px-6 py-4 text-sm font-semibold text-[#172033]">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((application) => {
                const paidPaymentsCount = application.payments.filter(
                  (payment) => payment.status === "PAID"
                ).length;

                return (
                  <tr key={application.id} className="border-b border-[#E2E8F0] transition hover:bg-[#F7F9FC]/50 last:border-b-0">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#172033]">{application.student.fullName}</p>
                      <p className="mt-1 text-sm text-[#7A8494]">{application.student.matricNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6474]">{application.skill.name}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        application.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        application.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5B6474]">
                      {paidPaymentsCount}/{application.payments.length} paid
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/admin/applications/${application.id}`}
                        className="font-semibold text-[#1D5FA7] hover:text-[#174F8C]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {recentApplications.length === 0 && (
            <div className="p-8 text-center text-sm text-[#7A8494]">
              No applications found.
            </div>
          )}
        </div>
        <div className="border-t border-[#E2E8F0] p-4 text-center sm:hidden">
          <Link 
            href="/dashboard/admin/applications"
            className="text-sm font-semibold text-[#1D5FA7] hover:text-[#0F2747]"
          >
            View All Applications
          </Link>
        </div>
      </section>
    </div>
  );
}