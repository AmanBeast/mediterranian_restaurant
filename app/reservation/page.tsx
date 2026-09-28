import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ReservationWizard } from "@/components/reservation/ReservationWizard";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Secure your table at Élaia Mediterranean Table. Select from the Pergola Garden Patio, Main Dining Salon, or Chef's Hearth Counter.",
};

export default function ReservationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Book an Experience
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-3">
              Reserve Your Table
            </h1>
            <p className="text-sm text-[#DED7CB]/80 font-light leading-relaxed">
              Slow-crafted coastal dining under olive branches and glowing hearth embers.
            </p>
          </div>

          <ReservationWizard />
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
