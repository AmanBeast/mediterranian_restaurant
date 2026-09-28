import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "Our Provenance & Story",
  description:
    "Learn about Élaia's origins: third-generation Peloponnese olive groves, wood-fired stone hearths, and the slow-food philosophy of Chef Elena Rossi.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <div className="relative h-[340px] sm:h-[420px] rounded-3xl overflow-hidden glass-card">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaBn6-prF5Q5JFymaOjsQiu0Qpx_rtA5T1-V5EuSXIiaTr3K8a1pAk9GiaV8oG3ChvQXikVwm4KlYD8n7c2eIRz5eGb8-D1cQvfl9mWrx0y5J0j_8ZjsA1X3ZOOkAdzqxSow4CKHwU_n-3bFy2yHK_rJxOB6ns7pQPLBnL3e98TdZAekyKic22p3hfKgT2I2ja9afzrIK8XGiGINP4HEGMis-eSTFVfm6piuuNNjbc-kF1Oiynibpg2w"
              alt="Pergola Garden Patio at Sunset"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C100D] via-[#0C100D]/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold mb-2">
                Our Provenance
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] max-w-2xl leading-tight">
                Rooted in Heritage & Sun-Drenched Soil
              </h1>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D47D57] font-semibold block mb-2">
              The Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F3EEE7] leading-snug mb-6">
              Where Time Slows and Flavor Deepens
            </h2>
            <p className="text-sm sm:text-base text-[#DED7CB]/90 leading-relaxed font-light mb-4">
              At Élaia, dining is not merely sustenance; it is a sensory pilgrimage. Our story began on the sun-bleached terraces of southern Greece, where three generations of the Rossi and Thorne families tended groves of ancient Koroneiki olive trees overlooking the Aegean Sea.
            </p>
            <p className="text-sm sm:text-base text-[#DED7CB]/90 leading-relaxed font-light">
              We brought this reverent respect for terroir to our dining salon and hearth. Every morning, line-caught wild sea bass and octopus arrive fresh from regional fishermen. Our bread is fermented with wild starters, baked over open olive wood embers, and dipped in olive oil harvested from trees that have stood for centuries.
            </p>
          </div>

          {/* Pillars of Élaia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D] mb-4">
                <span className="material-symbols-outlined text-[22px]">local_florist</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F3EEE7] mb-2">
                Single-Estate Oil
              </h3>
              <p className="text-xs text-[#DED7CB]/75 leading-relaxed">
                Cold-pressed within four hours of harvest in the Peloponnese at sub-24°C temperatures, preserving natural vitality and polyphenols.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#18221B] border border-[#D47D57]/30 flex items-center justify-center text-[#D47D57] mb-4">
                <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F3EEE7] mb-2">
                Wood-Fired Hearth
              </h3>
              <p className="text-xs text-[#DED7CB]/75 leading-relaxed">
                Our hearth burns cured olive wood, wild vine clippings, and citrus boughs to impart delicate smoke notes to our seafood and skewers.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D] mb-4">
                <span className="material-symbols-outlined text-[22px]">wine_bar</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F3EEE7] mb-2">
                Botanical Mixology
              </h3>
              <p className="text-xs text-[#DED7CB]/75 leading-relaxed">
                Greek island mastiha, ironwort mountain teas, smoked fig cordials, and indigenous Aegean varietals curated for nocturnal leisure.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass-card rounded-2xl p-8 sm:p-10 text-center border border-white/10 mt-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7] mb-3">
              Experience the Table
            </h3>
            <p className="text-sm text-[#DED7CB]/80 max-w-md mx-auto mb-6">
              Join us under the pergola or at the chef&apos;s hearth counter for an evening of authentic Mediterranean hospitality.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/reservation"
                className="h-11 px-6 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Reserve a Table</span>
              </Link>
              <Link
                href="/chefs"
                className="h-11 px-6 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Meet the Chefs</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
