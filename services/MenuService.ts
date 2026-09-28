import { prisma } from "@/lib/prisma";

export interface MenuItemDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
  dietaryTags: string[];
  allergens: string[];
  isAvailable: boolean;
  isFeatured: boolean;
}

export class MenuService {
  static async getCategories() {
    return prisma.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
  }

  static async getMenuItems(options?: {
    categorySlug?: string;
    dietaryTag?: string;
    search?: string;
    onlyAvailable?: boolean;
    onlyFeatured?: boolean;
  }): Promise<MenuItemDto[]> {
    const where: any = {};

    if (options?.onlyAvailable !== false) {
      where.isAvailable = true;
    }

    if (options?.onlyFeatured) {
      where.isFeatured = true;
    }

    if (options?.categorySlug && options.categorySlug !== "all") {
      where.category = {
        slug: options.categorySlug,
      };
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { ingredients: { contains: q, mode: "insensitive" } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { name: "asc" }],
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    // Parse JSON fields safely and apply dietaryTag filter if present
    const parsed = items.map((item) => {
      let ingredients: string[] = [];
      let dietaryTags: string[] = [];
      let allergens: string[] = [];

      try {
        ingredients = JSON.parse(item.ingredients);
      } catch {
        ingredients = item.ingredients.split(",").map((s) => s.trim());
      }

      try {
        dietaryTags = JSON.parse(item.dietaryTags);
      } catch {
        dietaryTags = [];
      }

      try {
        allergens = JSON.parse(item.allergens);
      } catch {
        allergens = [];
      }

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        ingredients,
        price: Number(item.price),
        imageUrl: item.imageUrl,
        categoryId: item.categoryId,
        categoryName: item.category.name,
        dietaryTags,
        allergens,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
      };
    });

    if (options?.dietaryTag && options.dietaryTag !== "all") {
      return parsed.filter((item) =>
        item.dietaryTags.some(
          (t) => t.toLowerCase() === options.dietaryTag!.toLowerCase()
        )
      );
    }

    return parsed;
  }

  static async getFeaturedDish(): Promise<MenuItemDto | null> {
    const items = await this.getMenuItems({ onlyFeatured: true });
    return items.length > 0 ? items[0] : null;
  }

  static async getMenuItemBySlug(slug: string): Promise<MenuItemDto | null> {
    const item = await prisma.menuItem.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!item) return null;

    let ingredients: string[] = [];
    let dietaryTags: string[] = [];
    let allergens: string[] = [];

    try {
      ingredients = JSON.parse(item.ingredients);
    } catch {
      ingredients = [];
    }

    try {
      dietaryTags = JSON.parse(item.dietaryTags);
    } catch {
      dietaryTags = [];
    }

    try {
      allergens = JSON.parse(item.allergens);
    } catch {
      allergens = [];
    }

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      ingredients,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      categoryName: item.category.name,
      dietaryTags,
      allergens,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    };
  }
}
