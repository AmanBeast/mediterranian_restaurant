import type { Metadata } from "next";
import { MenuService } from "@/services/MenuService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MenuClient } from "@/components/menu/MenuClient";

export const metadata: Metadata = {
  title: "Tasting Menu & Cellar Selections",
  description:
    "Explore Élaia's seasonal Mediterranean menu: wood-fired charred octopus, Aegean branzino, mountain herbs, artisanal mezze, and botanical mixology.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const [categories, dishes] = await Promise.all([
    MenuService.getCategories(),
    MenuService.getMenuItems({ onlyAvailable: true }),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D]">
      <Header />
      <MenuClient initialCategories={categories} initialDishes={dishes} />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
