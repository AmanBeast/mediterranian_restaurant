import { prisma } from "@/lib/prisma";
import { GalleryCategory, BlogPostStatus } from "@prisma/client";

export class ContentService {
  static async getRestaurantSettings() {
    let settings = await prisma.restaurantSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          id: "default",
          restaurantName: "Élaia Mediterranean Table",
          tagline: "Rooted in Heritage & Sun-Drenched Soil",
          address: "428 Coastal Vista Way, Marina Promenade",
          phone: "+1 (800) 555-3524",
          email: "reservations@elaia-table.com",
          timezone: "America/New_York",
          slotLengthMinutes: 30,
          maxPartySize: 12,
          maxDaysAhead: 30,
          capacityPerSlot: 40,
          openingHours: JSON.stringify({
            monday: { open: "11:30", close: "22:30", isClosed: false },
            tuesday: { open: "11:30", close: "22:30", isClosed: false },
            wednesday: { open: "11:30", close: "22:30", isClosed: false },
            thursday: { open: "11:30", close: "23:00", isClosed: false },
            friday: { open: "11:30", close: "23:30", isClosed: false },
            saturday: { open: "11:00", close: "23:30", isClosed: false },
            sunday: { open: "11:00", close: "22:00", isClosed: false },
          }),
        },
      });
    }

    return settings;
  }

  static async getChefs() {
    return prisma.chef.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  static async getChefBySlug(slug: string) {
    return prisma.chef.findUnique({
      where: { slug },
    });
  }

  static async getTestimonials() {
    return prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  }

  static async getGalleryImages(category?: GalleryCategory) {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    return prisma.galleryImage.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });
  }

  static async getBlogPosts(onlyPublished = true) {
    const where: any = {};
    if (onlyPublished) {
      where.status = BlogPostStatus.PUBLISHED;
    }
    return prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });
  }

  static async getBlogPostBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
    });
  }
}
