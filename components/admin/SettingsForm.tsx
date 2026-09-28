"use client";

import { useTransition, useState } from "react";
import { updateRestaurantSettingsAction } from "@/actions/admin-settings";

interface SettingsFormProps {
  initialSettings: {
    restaurantName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    capacityPerSlot: number;
    maxPartySize: number;
    maxDaysAhead: number;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateRestaurantSettingsAction({
        restaurantName: formData.get("restaurantName") as string,
        tagline: formData.get("tagline") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        capacityPerSlot: parseInt(formData.get("capacityPerSlot") as string, 10),
        maxPartySize: parseInt(formData.get("maxPartySize") as string, 10),
        maxDaysAhead: parseInt(formData.get("maxDaysAhead") as string, 10),
      });
      setSuccess(true);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col gap-5 text-xs">
      {success && (
        <div role="alert" className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200">
          Settings successfully updated and applied in real-time.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
            Restaurant Name
          </label>
          <input
            name="restaurantName"
            type="text"
            defaultValue={initialSettings.restaurantName}
            required
            className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
            Tagline
          </label>
          <input
            name="tagline"
            type="text"
            defaultValue={initialSettings.tagline}
            required
            className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
            Phone
          </label>
          <input
            name="phone"
            type="text"
            defaultValue={initialSettings.phone}
            required
            className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={initialSettings.email}
            required
            className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
          Address
        </label>
        <input
          name="address"
          type="text"
          defaultValue={initialSettings.address}
          required
          className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
        />
      </div>

      {/* Capacity & Reservation Rules */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-sm font-serif font-bold text-[#FAB44D] mb-3">
          Reservation & Capacity Engine Rules
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
              Capacity Per Time Slot (Seats)
            </label>
            <input
              name="capacityPerSlot"
              type="number"
              min="1"
              max="200"
              defaultValue={initialSettings.capacityPerSlot}
              required
              className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
            />
            <span className="text-[10px] text-[#DED7CB]/50 mt-1 block">
              Max guest seats bookable concurrently per slot
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
              Max Party Size
            </label>
            <input
              name="maxPartySize"
              type="number"
              min="1"
              max="30"
              defaultValue={initialSettings.maxPartySize}
              required
              className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
            />
            <span className="text-[10px] text-[#DED7CB]/50 mt-1 block">
              Online booking limit per reservation
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#DED7CB]/70 uppercase block mb-1">
              Booking Horizon (Days)
            </label>
            <input
              name="maxDaysAhead"
              type="number"
              min="1"
              max="180"
              defaultValue={initialSettings.maxDaysAhead}
              required
              className="w-full h-10 px-3 rounded-lg bg-[#0C100D] border border-white/10 text-[#F3EEE7] focus:outline-none focus:border-[#FAB44D]"
            />
            <span className="text-[10px] text-[#DED7CB]/50 mt-1 block">
              How far ahead guests can reserve
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta shadow-md active:scale-95 transition-all"
        >
          {isPending ? "Saving Rules..." : "Save Restaurant Rules"}
        </button>
      </div>
    </form>
  );
}
