import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "Culinary Artisans & Chefs",
  description:
    "Meet the culinary visionaries of Élaia Mediterranean Table: Executive Chef Elena Rossi and Master of Hearth Nikos Andreadis.",
};

export const revalidate = 60;

export default async function ChefsPage() {
  const chefs = await ContentService.getChefs();

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Masters of Hearth & Soil
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-4">
              Our Culinary Artisans
            </h1>
            <p className="text-sm sm:text-base text-[#DED7CB]/80 leading-relaxed font-light">
              Guided by a deep reverence for Mediterranean slow-food integrity, our kitchen is led by chefs who have staged in historic coastal kitchens across Athens, San Sebastián, and Naples.
            </p>
          </div>

          {/* Chefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {chefs.map((chef) => {
              let signatures: string[] = [];
              try {
                signatures = JSON.parse(chef.signatureDishes);
              } catch {
                signatures = [];
              }

              return (
                <div
                  key={chef.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 group hover:border-[#FAB44D]/30 transition-all"
                >
                  <div className="relative h-80 w-full overflow-hidden bg-[#0C100D]">
                    <Image
                      src={chef.imageUrl}
                      alt={chef.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <span className="text-xs uppercase tracking-wider text-[#FAB44D] font-semibold">
                        {chef.roleTitle}
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-[#F3EEE7] mt-0.5">
                        {chef.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                    <p className="text-sm text-[#DED7CB]/85 leading-relaxed font-light mb-6">
                      {chef.bio}
                    </p>

                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#DED7CB]/60 mb-2">
                        Signature Creations
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {signatures.map((dish) => (
                          <span
                            key={dish}
                            className="text-xs px-2.5 py-1 rounded-md bg-[#1C261F] text-[#FAB44D] border border-white/5 font-serif"
                          >
                            {dish}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/chefs/${chef.slug}`}
                        className="w-full h-10 glass-obsidian hover:bg-[#D47D57] hover:text-white text-[#F3EEE7] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <span>View Chef Profile & Philosophy</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
