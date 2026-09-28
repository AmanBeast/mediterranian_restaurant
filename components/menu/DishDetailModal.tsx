"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { MenuItemDto } from "@/services/MenuService";

interface DishDetailModalProps {
  dish: MenuItemDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DishDetailModal({ dish, isOpen, onClose }: DishDetailModalProps) {
  if (!isOpen || !dish) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[88vh] my-auto flex flex-col bg-[#141C16] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-up text-[#F3EEE7]">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close dish details"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0C100D]/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#DED7CB] hover:text-white transition-colors shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
        </button>

        {/* Dish Hero Image */}
        <div className="relative h-44 sm:h-64 w-full shrink-0 bg-[#0C100D]">
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141C16] via-transparent to-black/30" />
          {dish.isFeatured && (
            <div className="absolute top-4 left-4">
              <Badge variant="terracotta" className="font-semibold uppercase tracking-wider text-[11px]">
                <span className="material-symbols-outlined text-[13px] material-symbols-fill">star</span>
                Chef&apos;s Signature
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 right-4 px-3.5 py-1 rounded-lg glass-obsidian text-lg font-serif font-bold text-[#FAB44D] border border-[#FAB44D]/20 shadow-md">
            {formatPrice(dish.price)}
          </div>
        </div>

        {/* Dish Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-medium">
              {dish.categoryName || "Artisan Fare"}
            </span>
            <h2 id="dish-modal-title" className="font-serif text-2xl font-bold text-[#F3EEE7] mt-1 leading-snug">
              {dish.name}
            </h2>
          </div>

          <p className="text-sm text-[#DED7CB]/90 leading-relaxed">
            {dish.description}
          </p>

          {/* Dietary & Allergen Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dish.dietaryTags.map((tag) => (
              <Badge key={tag} variant="olive">
                {tag}
              </Badge>
            ))}
            {dish.allergens.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-white/5 text-[#DED7CB]/70 border border-white/10">
                Contains: {dish.allergens.join(", ")}
              </span>
            )}
          </div>

          {/* Ingredients list */}
          {dish.ingredients.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#DED7CB]/60 block mb-2">
                Highlighted Ingredients
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#1C261F] text-[#F3EEE7]/90 border border-white/5"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href={`/reservation?seating=MAIN&request=${encodeURIComponent(`We are excited to taste the ${dish.name}!`)}`}
              onClick={onClose}
              className="flex-1 h-11 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 glow-terracotta"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Reserve Table for this Dish</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
