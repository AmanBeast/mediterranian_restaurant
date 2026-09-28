"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { AuditService } from "@/services/AuditService";
import { UserRole } from "@prisma/client";

export async function toggleMenuItemAvailability(id: string) {
  // STAFF or ADMIN can toggle availability
  const session = await requireAuth([UserRole.ADMIN, UserRole.STAFF]);

  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) throw new Error("Menu item not found.");

  const updated = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
  });

  await AuditService.log({
    userId: session.userId,
    action: "MENU_AVAILABILITY_TOGGLED",
    entityType: "MenuItem",
    entityId: id,
    details: { name: item.name, isAvailable: updated.isAvailable },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true, isAvailable: updated.isAvailable };
}

export async function createMenuItemAction(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  ingredients: string[];
  dietaryTags: string[];
  allergens: string[];
  isFeatured?: boolean;
}) {
  // ADMIN only
  const session = await requireAuth([UserRole.ADMIN]);

  const created = await prisma.menuItem.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      ingredients: JSON.stringify(data.ingredients),
      dietaryTags: JSON.stringify(data.dietaryTags),
      allergens: JSON.stringify(data.allergens),
      isFeatured: data.isFeatured ?? false,
      isAvailable: true,
    },
  });

  await AuditService.log({
    userId: session.userId,
    action: "MENU_ITEM_CREATED",
    entityType: "MenuItem",
    entityId: created.id,
    details: { name: created.name, price: data.price },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true, item: created };
}

export async function deleteMenuItemAction(id: string) {
  // ADMIN only
  const session = await requireAuth([UserRole.ADMIN]);

  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) throw new Error("Item not found.");

  await prisma.menuItem.delete({ where: { id } });

  await AuditService.log({
    userId: session.userId,
    action: "MENU_ITEM_DELETED",
    entityType: "MenuItem",
    entityId: id,
    details: { name: item.name },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}
