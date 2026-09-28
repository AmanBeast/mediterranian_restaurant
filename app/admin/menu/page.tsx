import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { MenuItemControls } from "@/components/admin/MenuItemControls";

export default async function AdminMenuPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
    prisma.menuItem.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { category: { select: { name: true } } },
    }),
  ]);

  const mappedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: Number(item.price),
    imageUrl: item.imageUrl,
    categoryId: item.categoryId,
    categoryName: item.category.name,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
  }));

  return (
    <div className="flex flex-col gap-6">
      <MenuItemControls
        items={mappedItems}
        categories={categories}
        userRole={session.role}
      />
    </div>
  );
}
