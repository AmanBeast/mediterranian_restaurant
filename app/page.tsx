import { MenuService } from "@/services/MenuService";
import { ContentService } from "@/services/ContentService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { HomeClient } from "@/components/home/HomeClient";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [featuredDish, categories, menuItems, chefs, testimonials, settings] =
    await Promise.all([
      MenuService.getFeaturedDish(),
      MenuService.getCategories(),
      MenuService.getMenuItems({ onlyAvailable: true }),
      ContentService.getChefs(),
      ContentService.getTestimonials(),
      ContentService.getRestaurantSettings(),
    ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.restaurantName,
    image: featuredDish?.imageUrl || "https://elaia-table.com/og-image.jpg",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Marina Promenade",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    servesCuisine: ["Mediterranean", "Greek", "Aegean", "Seafood"],
    priceRange: "$$$",
    acceptsReservations: "True",
    url: "https://elaia-table.com",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0C100D]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HomeClient
        featuredDish={featuredDish}
        categories={categories}
        menuItems={menuItems}
        chefs={chefs}
        testimonials={testimonials}
        settings={settings}
      />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
