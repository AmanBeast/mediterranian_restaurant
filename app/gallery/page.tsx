import type { Metadata } from "next";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Atmosphere & Culinary Gallery",
  description:
    "Explore the visual world of Élaia Mediterranean Table: sun-drenched pergolas, wood-fired hearths, and plated Aegean gastronomy.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await ContentService.getGalleryImages();

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D]">
      <Header />
      <GalleryClient images={images} />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
