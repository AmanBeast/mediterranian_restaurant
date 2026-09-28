"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { DishDetailModal } from "@/components/menu/DishDetailModal";
import type { MenuItemDto } from "@/services/MenuService";

interface MenuClientProps {
  initialCategories: { id: string; name: string; slug: string }[];
  initialDishes: MenuItemDto[];
}

const DIETARY_FILTERS = [
  "All",
  "Gluten-Free",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Pescatarian",
];

export function MenuClient({ initialCategories, initialDishes }: MenuClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDish, setActiveDish] = useState<MenuItemDto | null>(null);

  const filteredDishes = useMemo(() => {
    return initialDishes.filter((dish) => {
      // Category match
      if (selectedCategory !== "all") {
        const cat = initialCategories.find((c) => c.slug === selectedCategory);
        if (cat && dish.categoryId !== cat.id) return false;
      }

      // Dietary match
      if (selectedDietary !== "All") {
        const hasTag = dish.dietaryTags.some(
          (t) => t.toLowerCase() === selectedDietary.toLowerCase()
        );
        if (!hasTag) return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesIng = dish.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      return true;
    });
  }, [initialDishes, selectedCategory, selectedDietary, searchQuery, initialCategories]);

  return (
    <>
      <main className="flex-1 pt-24 pb-28 lg:pb-16 bg-[#0C100D] text-[#F3EEE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Bespoke Coastal Dining
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-4">
              The Aegean Tasting Menu
            </h1>
            <p className="text-sm sm:text-base text-[#DED7CB]/80 leading-relaxed font-light">
              Crafted over olive wood hearths and inspired by generations of Greek and Mediterranean island traditions. Every dish celebrates single-estate olive oil and day-boat Aegean seafood.
            </p>
          </div>

          {/* Search Bar & Category Controls */}
          <div className="glass-obsidian rounded-2xl p-4 sm:p-6 mb-8 border border-white/10 flex flex-col gap-5">
            {/* Search Input */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#DED7CB]/50 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients, or spices (e.g., octopus, feta, lamb)..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/40 focus:outline-none focus:border-[#FAB44D]/70 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#DED7CB]/60 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DED7CB]/60">
                Courses
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all",
                    selectedCategory === "all"
                      ? "bg-[#D47D57] text-white shadow-md glow-terracotta"
                      : "glass-obsidian text-[#DED7CB] hover:bg-white/10"
                  )}
                >
                  All Courses ({initialDishes.length})
                </button>

                {initialCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all",
                      selectedCategory === cat.slug
                        ? "bg-[#D47D57] text-white shadow-md glow-terracotta"
                        : "glass-obsidian text-[#DED7CB] hover:bg-white/10"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Tags Filter */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DED7CB]/60">
                Dietary Preferences
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {DIETARY_FILTERS.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setSelectedDietary(diet)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                      selectedDietary === diet
                        ? "bg-[#2D4231] text-[#B4CEA5] border border-[#405D45]"
                        : "bg-white/5 text-[#DED7CB]/70 hover:bg-white/10 border border-white/5"
                    )}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count & Active Filter Indicator */}
          <div className="flex items-center justify-between mb-6 text-xs text-[#DED7CB]/70">
            <span>Showing {filteredDishes.length} artisanal dishes</span>
            {(selectedCategory !== "all" || selectedDietary !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDietary("All");
                  setSearchQuery("");
                }}
                className="text-[#FAB44D] hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Dishes Grid */}
          {filteredDishes.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8">
              <span className="material-symbols-outlined text-4xl text-[#FAB44D] mb-3">
                search_off
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3EEE7] mb-2">
                No matching dishes found
              </h3>
              <p className="text-xs text-[#DED7CB]/70 mb-5">
                Try selecting another category or clearing your dietary filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDietary("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#D47D57] text-white rounded-lg text-xs font-semibold"
              >
                View Full Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-[#0C100D]">
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-transparent opacity-80" />
                    {dish.isFeatured && (
                      <span className="absolute top-3 left-3 bg-[#D47D57] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] material-symbols-fill">star</span>
                        Signature
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 glass-obsidian text-[#FAB44D] font-serif text-base font-bold px-3 py-1 rounded-lg border border-[#FAB44D]/30 shadow-md">
                      {formatPrice(dish.price)}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-[#FAB44D] font-medium">
                          {dish.categoryName}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#F3EEE7] leading-snug mb-2 group-hover:text-[#FAB44D] transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-[#DED7CB]/80 line-clamp-3 leading-relaxed mb-4">
                        {dish.description}
                      </p>

                      {/* Dietary Badges */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {dish.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4231]/40 text-[#B4CEA5] border border-[#405D45]/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setActiveDish(dish)}
                        className="flex-1 h-9 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>View Details</span>
                      </button>

                      <Link
                        href={`/reservation?dish=${encodeURIComponent(dish.name)}`}
                        className="h-9 px-3.5 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">event_seat</span>
                        <span>Book</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <DishDetailModal
        dish={activeDish}
        isOpen={!!activeDish}
        onClose={() => setActiveDish(null)}
      />
    </>
  );
}
