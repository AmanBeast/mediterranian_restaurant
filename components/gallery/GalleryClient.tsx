"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GalleryCategory } from "@prisma/client";

interface GalleryImageDto {
  id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
}

interface GalleryClientProps {
  images: GalleryImageDto[];
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Curations", value: "ALL" },
  { label: "Artisan Food", value: GalleryCategory.FOOD },
  { label: "Restaurant", value: GalleryCategory.RESTAURANT },
  { label: "People & Chefs", value: GalleryCategory.PEOPLE },
  { label: "Atmosphere", value: GalleryCategory.ATMOSPHERE },
];

export function GalleryClient({ images }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lightboxImage, setLightboxImage] = useState<GalleryImageDto | null>(null);

  const filtered =
    selectedCategory === "ALL"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <>
      <main className="flex-1 pt-24 pb-28 lg:pb-16 bg-[#0C100D] text-[#F3EEE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold block mb-2">
              Visual Narrative
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F3EEE7] mb-4">
              Atmosphere & Gastronomy
            </h1>
            <p className="text-sm sm:text-base text-[#DED7CB]/80 leading-relaxed font-light">
              Glimpses of sunlit pergolas, glowing olive wood hearth embers, and the handcrafted ceramics of Élaia.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 scrollbar-none mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all",
                  selectedCategory === cat.value
                    ? "bg-[#D47D57] text-white shadow-md glow-terracotta"
                    : "glass-obsidian text-[#DED7CB] hover:bg-white/10"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="relative h-72 sm:h-80 rounded-2xl overflow-hidden glass-card cursor-pointer group border border-white/5 hover:border-[#FAB44D]/30 transition-all duration-300"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[11px] uppercase tracking-wider text-[#FAB44D] font-semibold">
                    {img.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            aria-label="Close Lightbox"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full glass-obsidian flex items-center justify-center text-white hover:text-[#FAB44D] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          <div
            className="relative max-w-4xl w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.imageUrl}
              alt={lightboxImage.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-4 inset-x-4 max-w-md mx-auto glass-obsidian px-4 py-2.5 rounded-xl text-center border border-white/10">
              <span className="text-xs uppercase tracking-wider text-[#FAB44D] font-semibold">
                {lightboxImage.category}
              </span>
              <p className="font-serif text-base font-bold text-white mt-0.5">
                {lightboxImage.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
