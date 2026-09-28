"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { AuditService } from "@/services/AuditService";
import { UserRole } from "@prisma/client";

export async function updateRestaurantSettingsAction(data: {
  restaurantName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  capacityPerSlot: number;
  maxPartySize: number;
  maxDaysAhead: number;
}) {
  // Strictly ADMIN only
  const session = await requireAuth([UserRole.ADMIN]);

  const updated = await prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: { ...data },
    create: {
      id: "default",
      ...data,
      openingHours: JSON.stringify({}),
    },
  });

  await AuditService.log({
    userId: session.userId,
    action: "SETTINGS_UPDATED",
    entityType: "RestaurantSettings",
    entityId: "default",
    details: data,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");

  return { success: true, settings: updated };
}
