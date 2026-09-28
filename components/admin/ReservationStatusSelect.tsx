"use client";

import { useTransition } from "react";
import { updateReservationStatusAction } from "@/actions/admin-reservations";
import { ReservationStatus } from "@prisma/client";

interface ReservationStatusSelectProps {
  id: string;
  initialStatus: ReservationStatus;
}

export function ReservationStatusSelect({
  id,
  initialStatus,
}: ReservationStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ReservationStatus;
    startTransition(async () => {
      await updateReservationStatusAction(id, newStatus);
    });
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-500/30";
      case "COMPLETED":
        return "text-[#B4CEA5] bg-[#2D4231]/60 border-[#405D45]/40";
      case "CANCELLED":
        return "text-red-400 bg-red-950/60 border-red-500/30";
      case "NO_SHOW":
        return "text-amber-400 bg-amber-950/60 border-amber-500/30";
      default:
        return "text-[#DED7CB] bg-white/5 border-white/10";
    }
  };

  return (
    <div className="relative inline-block">
      <select
        defaultValue={initialStatus}
        disabled={isPending}
        onChange={handleChange}
        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer disabled:opacity-50 transition-colors ${getStatusColor(
          initialStatus
        )}`}
      >
        <option value="CONFIRMED" className="bg-[#0C100D] text-emerald-400">
          CONFIRMED
        </option>
        <option value="COMPLETED" className="bg-[#0C100D] text-[#B4CEA5]">
          COMPLETED
        </option>
        <option value="CANCELLED" className="bg-[#0C100D] text-red-400">
          CANCELLED
        </option>
        <option value="NO_SHOW" className="bg-[#0C100D] text-amber-400">
          NO SHOW
        </option>
      </select>
      {isPending && (
        <span className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FAB44D] animate-ping" />
      )}
    </div>
  );
}
