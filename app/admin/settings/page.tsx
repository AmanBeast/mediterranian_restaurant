import { ContentService } from "@/services/ContentService";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Strictly ADMIN only
  if (session.role !== "ADMIN") {
    redirect("/admin");
  }

  const settings = await ContentService.getRestaurantSettings();

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-white/10">
        <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
          System Administration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7]">
          Restaurant Rules & Capacity Engine
        </h1>
        <p className="text-xs text-[#DED7CB]/70 mt-1">
          Adjust slot capacity, booking window, party limits, and operational parameters
        </p>
      </div>

      <SettingsForm
        initialSettings={{
          restaurantName: settings.restaurantName,
          tagline: settings.tagline,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          capacityPerSlot: settings.capacityPerSlot,
          maxPartySize: settings.maxPartySize,
          maxDaysAhead: settings.maxDaysAhead,
        }}
      />
    </div>
  );
}
