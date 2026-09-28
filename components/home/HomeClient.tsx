"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { DishDetailModal } from "@/components/menu/DishDetailModal";
import type { MenuItemDto } from "@/services/MenuService";

interface HomeClientProps {
  featuredDish: MenuItemDto | null;
  categories: { id: string; name: string; slug: string }[];
  menuItems: MenuItemDto[];
  chefs: any[];
  testimonials: any[];
  settings: any;
}

export function HomeClient({
  featuredDish,
  categories,
  menuItems,
  testimonials,
  settings,
}: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeDish, setActiveDish] = useState<MenuItemDto | null>(null);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => {
          const category = categories.find((c) => c.slug === selectedCategory);
          return category ? item.categoryId === category.id : true;
        });

  return (
    <>
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 lg:pb-0 bg-[#0C100D]">
        <div className="flex flex-col w-full max-w-7xl mx-auto">
          {/* 1. Hero Section */}
          <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-8">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-[#121814] border border-white/5">
              <div className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5bLyD8Obx4gTBTl0JvCdt8agowo7VSw4mvZ6lOoGcBpJZrkcAHvuJv7JuiqnWey3-v2jkLZvYfJK_jJwXSv5fe_UnRAFNpz5xL_dODphh_RCNGFDG_oxKkToH4m6Pm-OrZtBlNu49wpXgAopPAQchx-yLMSG-292rAulfPwfRMzsCBsKU93ryGmBCxuGchDZMwH_bAJ8AnmXej5_yf_oQiB2cIgeYA1Atwu1zj-2ExywipHwbbjz7_w"
                  alt="Sun-drenched Mediterranean dining table on a rustic stone terrace overlooking the azure sea"
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C100D] via-[#0C100D]/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-[#F3EEE7]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-obsidian self-start mb-3 border border-[#FAB44D]/30">
                    <span className="material-symbols-outlined text-[16px] text-[#FAB44D]">sunny</span>
                    <span className="text-xs uppercase tracking-wider text-[#FAB44D] font-semibold">
                      Aegean Inspired Gastronomy
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F3EEE7] leading-tight drop-shadow-md mb-3 max-w-2xl">
                    A Taste of the Mediterranean
                  </h1>

                  <p className="text-sm sm:text-base text-[#DED7CB]/90 max-w-lg mb-6 leading-relaxed">
                    Fresh ingredients, wood-fired coastal traditions, and unhurried hospitality under ancient olive branches.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md">
                    <Link
                      href="/reservation"
                      className="h-12 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg glow-terracotta transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                      <span>Reserve a Table</span>
                    </Link>

                    <Link
                      href="/menu"
                      className="h-12 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                      <span>Explore Menu</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Reservation Bar Snippet */}
              <div className="p-3.5 sm:p-4 bg-[#141C16] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0C100D] border border-white/5 text-[#F3EEE7] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#D47D57]">today</span>
                    <span className="font-medium">Tonight</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0C100D] border border-white/5 text-[#F3EEE7] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#D47D57]">group</span>
                    <span className="font-medium">2 Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0C100D] border border-white/5 text-[#F3EEE7] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#D47D57]">schedule</span>
                    <span className="font-medium">7:30 PM</span>
                  </div>
                </div>

                <Link
                  href="/reservation"
                  className="w-full sm:w-auto h-10 px-5 bg-[#3E5434] hover:bg-[#405D45] text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>Find Available Table</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* 2. Guest Favorite Spotlight */}
          {featuredDish && (
            <section className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#D47D57] font-semibold block mb-1">
                    Chef&apos;s Signature
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7]">
                    Our Guests&apos; Favorite
                  </h2>
                </div>
                <span className="text-xs text-[#FAB44D] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] material-symbols-fill">star</span>
                  Top Rated Dish
                </span>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 sm:h-80 md:h-full w-full min-h-[260px]">
                  <Image
                    src={featuredDish.imageUrl}
                    alt={featuredDish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#D47D57] text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-[14px] material-symbols-fill">star</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Most Loved</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg glass-obsidian text-lg font-serif font-bold text-[#FAB44D] border border-[#FAB44D]/30 shadow-md">
                    {formatPrice(featuredDish.price)}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7] mb-2 leading-snug">
                      {featuredDish.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4 text-xs">
                      <div className="flex text-[#FAB44D]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px] material-symbols-fill">
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-bold text-[#F3EEE7]">4.9</span>
                      <span className="text-[#DED7CB]/60">(340+ verified guest reviews)</span>
                    </div>

                    <p className="text-sm text-[#DED7CB]/90 leading-relaxed mb-6">
                      {featuredDish.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featuredDish.dietaryTags.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-[#2D4231]/50 text-[#B4CEA5] border border-[#405D45]/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/reservation"
                      className="flex-1 h-11 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      <span>Reserve Table</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveDish(featuredDish)}
                      className="h-11 px-4 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>View Dish</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. Menu Preview & Filter Chips */}
          <section className="py-8">
            <div className="px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D47D57] font-semibold block mb-1">
                  Curated Fare
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3EEE7]">
                  Seasonal Offerings
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-xs font-semibold uppercase tracking-wider text-[#FAB44D] hover:underline flex items-center gap-1"
              >
                <span>Full Menu</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            {/* Category Filter Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all",
                  selectedCategory === "all"
                    ? "bg-[#D47D57] text-white shadow-md glow-terracotta"
                    : "glass-obsidian text-[#DED7CB] hover:bg-white/10"
                )}
              >
                All Offerings
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all",
                    selectedCategory === cat.slug
                      ? "bg-[#D47D57] text-white shadow-md glow-terracotta"
                      : "glass-obsidian text-[#DED7CB] hover:bg-white/10"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Horizontal Swipeable Cards on Mobile / Responsive Grid on Desktop */}
            <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 snap-x snap-mandatory scrollbar-none">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-[260px] sm:w-[280px] lg:w-auto glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[#0C100D]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 260px, 320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-2.5 right-2.5 glass-obsidian text-[#FAB44D] text-xs font-bold px-2.5 py-0.5 rounded-lg border border-[#FAB44D]/20">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#F3EEE7] leading-snug mb-1.5 group-hover:text-[#FAB44D] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#DED7CB]/75 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDish(item)}
                      className="mt-4 w-full h-9 glass-obsidian hover:bg-[#D47D57] hover:text-white text-[#DED7CB] rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Details & Tasting</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Mediterranean Story Editorial Teaser */}
          <section className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative bg-[#141C16] border border-white/10 text-[#F3EEE7] rounded-2xl overflow-hidden p-6 sm:p-10 shadow-2xl">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#3E5434]/20 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[20px] text-[#FAB44D]">psychiatry</span>
                <span className="text-xs uppercase tracking-wider text-[#FAB44D] font-semibold">
                  Our Provenance
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#F3EEE7] mb-4 leading-snug max-w-xl">
                Rooted in Heritage & Sun-Drenched Soil
              </h3>

              <p className="text-sm sm:text-base text-[#DED7CB]/90 mb-6 leading-relaxed max-w-2xl">
                From third-generation family olive groves in the Peloponnese to the wood-fired stone hearths in our kitchen, Élaia honors timeless coastal cooking traditions where every dish begins with patient harvesting and pure intention.
              </p>

              <div className="flex items-center gap-3.5 pt-2">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#FAB44D]/40">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWuSgp4T-h2tk_Ab3kucaT4qn1aZ09QvycGs0hTRFlspsJH8s52ASKnOj_f0za9zLEloMHMceTGpRHLUA4kAKbEG85noiJcJwxJPgY2SZE7UAfzmDtwVd5iKFumcROCbI8sgPwSC1f2oQwrh0PMMZohzwmFBV7qhX3K7OKwDsjFRjKTtIUrHRySAs4Evgx176pN5qm21n3Anl0d4S4qBh8BNgV_fE7uU90ZQAzTb76WShtMx5eUCWx_g"
                    alt="Executive Chef Elena Rossi"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-base font-bold text-[#F3EEE7]">Elena Rossi</p>
                  <p className="text-xs text-[#FAB44D]">Executive Chef & Co-Founder</p>
                </div>
              </div>

              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFB597] hover:text-white transition-colors"
              >
                <span>Discover Our Story & Meet the Culinary Team</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* 5. Testimonial Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#FAB44D] mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px] material-symbols-fill">
                          star
                        </span>
                      ))}
                    </div>
                    <blockquote className="font-serif text-lg sm:text-xl text-[#F3EEE7] mb-4 italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-[#D47D57] text-white flex items-center justify-center font-bold text-xs">
                      {t.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F3EEE7]">{t.authorName}</p>
                      <p className="text-[11px] text-[#DED7CB]/60">{t.diningOccasion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Location & Hours Quick Card */}
          <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-12">
            <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#18221B] border border-[#FAB44D]/30 flex items-center justify-center text-[#FAB44D] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">location_on</span>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#F3EEE7]">
                    {settings.address}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-[#DED7CB]/80">Open Today • 11:30 AM – 11:30 PM</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  href="/reservation"
                  className="flex-1 md:flex-none h-11 px-6 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Book Table</span>
                </Link>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                  aria-label="Call Restaurant"
                  className="w-12 h-11 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl flex items-center justify-center active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={activeDish}
        isOpen={!!activeDish}
        onClose={() => setActiveDish(null)}
      />
    </>
  );
}
