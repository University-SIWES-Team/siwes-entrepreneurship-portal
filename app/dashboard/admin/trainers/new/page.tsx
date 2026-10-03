import Link from "next/link";
import { registerTrainer } from "@/app/actions/trainer-management";
import LoadingButton from "@/app/components/LoadingButton";

export default function AddTrainerPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard/admin/trainers"
          className="text-sm font-semibold text-[#1D5FA7] hover:underline"
        >
          ← Back to Trainers
        </Link>

        <div className="mt-6 border-b border-[#E2E8F0] pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1D5FA7]">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F2747]">
            Register New Trainer
          </h1>
          <p className="mt-2 text-sm text-[#5B6474]">
            Create a new trainer account. They can use these credentials to log into the portal.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          <form action={registerTrainer} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#172033]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  className="mt-2 block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172033]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="trainer@university.edu"
                  className="mt-2 block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172033]">
                  Temporary Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="mt-2 block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#172033]">
                  Skill Specialty
                </label>
                <input
                  type="text"
                  name="specialty"
                  required
                  placeholder="e.g. Web Development, Catering, Barbing"
                  className="mt-2 block w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#172033] placeholder-[#7A8494] focus:border-[#1D5FA7] focus:outline-none focus:ring-1 focus:ring-[#1D5FA7]"
                />
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6 flex justify-end">
              <LoadingButton loadingText="Registering Trainer..." className="w-full sm:w-auto px-8 py-3">
                Create Account
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}