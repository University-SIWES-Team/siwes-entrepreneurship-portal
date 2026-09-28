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

export default async function AdminApplicationsPage() {
  await getAdmin();

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      skill: true,
      payments: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <a
            href="/dashboard/admin"
            className="text-sm font-semibold text-[#1D5FA7] hover:underline"
          >
            ← Back to Dashboard
          </a>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F2747] sm:text-4xl">
            Student Applications
          </h1>

          <p className="mt-3 text-base leading-7 text-[#5B6474]">
            Review student applications, payment progress and programme
            selections.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
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
                    Payments
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-[#172033]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => {
                  const paidPayments = application.payments.filter(
                    (payment) => payment.status === "PAID",
                  ).length;

                  const statusClasses = {
                    PENDING: "bg-yellow-100 text-yellow-700",
                    APPROVED: "bg-green-100 text-green-700",
                    REJECTED: "bg-red-100 text-red-700",
                  };

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
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[application.status]
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5B6474]">
                        {paidPayments}/{application.payments.length} paid
                      </td>

                      <td className="px-6 py-4 text-sm text-[#5B6474]">
                        {application.createdAt.toLocaleDateString()}
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

            {applications.length === 0 && (
              <div className="p-10 text-center text-sm text-[#7A8494]">
                No applications found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}