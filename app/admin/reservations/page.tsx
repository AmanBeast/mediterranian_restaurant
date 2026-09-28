import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReservationStatusSelect } from "@/components/admin/ReservationStatusSelect";

export default async function AdminReservationsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const reservations = await prisma.reservation.findMany({
    orderBy: [{ date: "desc" }, { timeSlot: "asc" }],
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
            Table Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7]">
            Guest Reservations
          </h1>
          <p className="text-xs text-[#DED7CB]/70 mt-1">
            Real-time table allocation, seating areas, and status controls
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141C16] text-[#DED7CB]/60 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Party</th>
                <th className="py-3 px-4">Atmosphere</th>
                <th className="py-3 px-4">Special Request</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FAB44D]">
                    {res.bookingRef}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#F3EEE7] block">
                      {new Date(res.date).toISOString().split("T")[0]}
                    </span>
                    <span className="font-mono text-[11px] text-[#DED7CB]/60">
                      {res.timeSlot}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#F3EEE7] block">
                      {res.customerName}
                    </span>
                    <span className="text-[11px] text-[#DED7CB]/60">
                      {res.customerEmail}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#F3EEE7]">
                    {res.partySize} Guests
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2D4231]/40 text-[#B4CEA5] border border-[#405D45]/30">
                      {res.seatingArea}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#DED7CB]/75 max-w-xs truncate">
                    {res.specialRequest || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <ReservationStatusSelect
                      id={res.id}
                      initialStatus={res.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
