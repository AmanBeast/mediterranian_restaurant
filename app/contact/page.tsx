import type { Metadata } from "next";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact, Location & Inquiries",
  description:
    "Visit Élaia at 428 Coastal Vista Way, Marina Promenade. View hours, get directions, or contact our hospitality concierge.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await ContentService.getRestaurantSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Hospitality Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-4">
              Connect With Élaia
            </h1>
            <p className="text-sm sm:text-base text-[#DED7CB]/80 leading-relaxed font-light">
              Whether you are planning an intimate anniversary, a bespoke tasting menu, or an evening gathering under our pergola terrace, our team is at your service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* Left: Contact Info & Hours */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Address card */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D]">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#FAB44D] font-semibold">
                      Location
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3EEE7]">
                      Marina Waterfront
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#DED7CB]/85 leading-relaxed mb-4">
                  {settings.address}
                </p>
                <div className="flex flex-col gap-2 text-xs">
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                    className="font-mono text-[#FAB44D] hover:underline flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    {settings.phone}
                  </a>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-[#DED7CB]/70 hover:text-white flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Operating Hours card */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#18221B] border border-[#D47D57]/30 flex items-center justify-center text-[#D47D57]">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#D47D57] font-semibold">
                      Dining Hours
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3EEE7]">
                      Dinner & Night Lounge
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-[#DED7CB]/85">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Monday – Wednesday</span>
                    <span className="font-mono text-[#F3EEE7]">11:30 AM – 10:30 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Thursday</span>
                    <span className="font-mono text-[#F3EEE7]">11:30 AM – 11:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Friday & Saturday</span>
                    <span className="font-mono text-[#FAB44D]">11:00 AM – 11:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-mono text-[#F3EEE7]">11:00 AM – 10:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Validated Form */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F3EEE7] mb-2">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-[#DED7CB]/75 mb-6">
                  Fill in your details below and our reservations concierge will respond within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
