import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If on login page, render children directly without sidebar
  if (!session) {
    return <div className="min-h-screen bg-[#0C100D]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0C100D] text-[#F3EEE7] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#080B09] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FAB44D] text-2xl">
                local_florist
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-[#F3EEE7]">
                Élaia Portal
              </span>
            </Link>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                session.role === "ADMIN"
                  ? "bg-[#D47D57] text-white"
                  : "bg-[#2D4231] text-[#B4CEA5]"
              }`}
            >
              {session.role}
            </span>
          </div>

          {/* User Info */}
          <div className="px-3 py-2 rounded-xl bg-[#141C16] border border-white/5">
            <p className="text-xs font-semibold text-[#F3EEE7] truncate">{session.name}</p>
            <p className="text-[11px] text-[#DED7CB]/60 truncate">{session.email}</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-[#DED7CB] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/reservations"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-[#DED7CB] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Reservations</span>
            </Link>

            <Link
              href="/admin/menu"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-[#DED7CB] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>Menu & Availability</span>
            </Link>

            {session.role === "ADMIN" && (
              <Link
                href="/admin/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-[#DED7CB] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>Restaurant Rules</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#DED7CB]/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Public Website</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
