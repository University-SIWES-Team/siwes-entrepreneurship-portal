import { logout } from "@/app/actions/auth";

export default function DashboardPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">You're logged in.</p>

      <form action={logout}>
        <button
          type="submit"
          className="mt-6 rounded bg-black px-4 py-2 text-white"
        >
          Log out
        </button>
      </form>
    </div>
  );
}