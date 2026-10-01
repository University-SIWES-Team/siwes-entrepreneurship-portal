import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import LoadingButton from "@/app/components/LoadingButton";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) {
      redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user || user.role !== "ADMIN") {
      redirect("/dashboard");
    }

    return user;
  } catch {
    redirect("/login");
  }
}

export default async function AdminDashboardPage() {
  await getAdmin();

  const [
    totalStudents,
    totalApplications,
    pendingApplications,
    paidPayments,
    recentApplications,
  ] = await Promise.all([
    prisma.student.count(),

    prisma.application.count(),

    prisma.application.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.payment.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.application.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        student: true,
        skill: true,
        payments: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-[#E2E8F0] pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
              Administration
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F2747] sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5B6474]">
              Manage students, applications, payments and programme activities.
            </p>
          </div>

          <form action={logout} className="shrink-0">
            <LoadingButton loadingText="Signing out...">
              Sign out
            </LoadingButton>
          </form>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#7A8494]">Total Students</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F2747]">
              {totalStudents}
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#7A8494]">Applications</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F2747]">
              {totalApplications}
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#7A8494]">Pending Applications</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F2747]">
              {pendingApplications}
            </p>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#7A8494]">Paid Payments</p>
            <p className="mt-2 text-3xl font-semibold text-[#0F2747]">
              {paidPayments}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1D5FA7]">
              Applications
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#172033]">
              Recent Applications
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-190 text-left">
              <thead className="border-b border-[#E2E8F0] bg-[#F7F9FC]">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Student
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Skill
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Application
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((application) => {
                  const paidPayments = application.payments.filter(
                    (payment) => payment.status === "PAID",
                  ).length;

                  return (
                    <tr
                      key={application.id}
                      className="border-b border-[#E2E8F0] last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#172033]">
                          {application.student.fullName}
                        </p>

                        <p className="mt-1 text-sm text-[#7A8494]">
                          {application.student.matricNumber}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5B6474]">
                        {application.skill.name}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          {application.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5B6474]">
                        {paidPayments}/{application.payments.length} paid
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={`/dashboard/admin/applications/${application.id}`}
                          className="font-semibold text-[#1D5FA7] hover:text-[#174F8C]"
                        >
                          View
                        </a>
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
        </section>
      </div>
    </main>
  );
}