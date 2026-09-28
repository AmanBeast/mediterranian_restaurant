import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AuditService } from "@/services/AuditService";
import Link from "next/link";
import { ReservationStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayReservationsCount,
    upcomingReservationsCount,
    totalMenuItems,
    availableMenuItems,
    unreadMessagesCount,
    recentLogs,
  ] = await Promise.all([
    prisma.reservation.count({
      where: {
        date: today,
        status: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW] },
      },
    }),
    prisma.reservation.count({
      where: {
        date: { gte: today },
        status: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW] },
      },
    }),
    prisma.menuItem.count(),
    prisma.menuItem.count({ where: { isAvailable: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    AuditService.getRecentLogs(8),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
            Élaia Operations
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#F3EEE7] mt-1">
            Welcome, {session.name}
          </h1>
          <p className="text-xs text-[#DED7CB]/70 mt-1">
            Role: <span className="font-semibold text-[#FAB44D]">{session.role}</span> • Session active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/reservations"
            className="h-10 px-4 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>View Bookings</span>
          </Link>
          <Link
            href="/admin/menu"
            className="h-10 px-4 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Menu Controls</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#DED7CB]/70 mb-2">
            <span>Today&apos;s Bookings</span>
            <span className="material-symbols-outlined text-[#FAB44D] text-[20px]">
              today
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#F3EEE7]">
              {todayReservationsCount}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1">Scheduled for tonight</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#DED7CB]/70 mb-2">
            <span>Total Upcoming</span>
            <span className="material-symbols-outlined text-[#D47D57] text-[20px]">
              calendar_month
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#F3EEE7]">
              {upcomingReservationsCount}
            </span>
            <p className="text-[11px] text-[#DED7CB]/60 mt-1">Future guest bookings</p>
          </div>
        </div>

        {/* Menu Inventory */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#DED7CB]/70 mb-2">
            <span>Active Menu</span>
            <span className="material-symbols-outlined text-[#B4CEA5] text-[20px]">
              restaurant
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#F3EEE7]">
              {availableMenuItems} / {totalMenuItems}
            </span>
            <p className="text-[11px] text-[#B4CEA5] mt-1">Dishes currently available</p>
          </div>
        </div>

        {/* Guest Inquiries */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#DED7CB]/70 mb-2">
            <span>Inquiries</span>
            <span className="material-symbols-outlined text-[#FAB44D] text-[20px]">
              mail
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#F3EEE7]">
              {unreadMessagesCount}
            </span>
            <p className="text-[11px] text-[#DED7CB]/60 mt-1">Unread contact inquiries</p>
          </div>
        </div>
      </div>

      {/* Recent Audit Activity */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F3EEE7]">
              Recent Audit Log Activity
            </h3>
            <p className="text-xs text-[#DED7CB]/60">
              Cryptographically verified staff & administrator actions
            </p>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-[#DED7CB]/50 py-4 text-center">
            No audit events recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-white/5 text-xs">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FAB44D]" />
                  <div>
                    <span className="font-semibold text-[#F3EEE7] font-mono">
                      {log.action}
                    </span>
                    <span className="text-[#DED7CB]/60 ml-2">
                      ({log.entityType})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[#DED7CB]/60">
                  <span>{log.user?.email || "System"}</span>
                  <span className="font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
