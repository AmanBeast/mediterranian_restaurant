import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chef = await ContentService.getChefBySlug(slug);
  if (!chef) return { title: "Chef Not Found" };

  return {
    title: `${chef.name} – ${chef.roleTitle}`,
    description: chef.bio.slice(0, 160),
  };
}

export default async function ChefDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const chef = await ContentService.getChefBySlug(slug);

  if (!chef) {
    notFound();
  }

  let signatures: string[] = [];
  try {
    signatures = JSON.parse(chef.signatureDishes);
  } catch {
    signatures = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D] text-[#F3EEE7]">
      <Header />

      <main className="flex-1 pt-24 pb-28 lg:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#DED7CB]/60 mb-6">
            <Link href="/chefs" className="hover:text-white transition-colors">
              Chefs
            </Link>
            <span>/</span>
            <span className="text-[#FAB44D]">{chef.name}</span>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden border border-white/10 grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-[380px] md:h-full w-full min-h-[350px] bg-[#0C100D]">
              <Image
                src={chef.imageUrl}
                alt={chef.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-1">
                  {chef.roleTitle}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3EEE7] mb-6">
                  {chef.name}
                </h1>

                <p className="text-sm sm:text-base text-[#DED7CB]/90 leading-relaxed font-light mb-8">
                  {chef.bio}
                </p>

                <div className="mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/60 mb-3">
                    Signature Tasting Creations
                  </h3>
                  <div className="flex flex-col gap-2">
                    {signatures.map((dish) => (
                      <div
                        key={dish}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1C261F] border border-white/5"
                      >
                        <span className="font-serif text-sm text-[#F3EEE7]">{dish}</span>
                        <Link
                          href="/menu"
                          className="text-xs text-[#FAB44D] hover:underline flex items-center gap-1"
                        >
                          <span>Explore on Menu</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/reservation"
                  className="flex-1 h-11 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta shadow-md transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Reserve Chef Counter</span>
                </Link>
                <Link
                  href="/chefs"
                  className="h-11 px-5 glass-obsidian hover:bg-white/10 text-[#DED7CB] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-all"
                >
                  All Chefs
                </Link>
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
