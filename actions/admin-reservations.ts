"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { AuditService } from "@/services/AuditService";
import { ReservationStatus, UserRole } from "@prisma/client";

export async function updateReservationStatusAction(
  id: string,
  newStatus: ReservationStatus
) {
  // STAFF or ADMIN can change reservation statuses
  const session = await requireAuth([UserRole.ADMIN, UserRole.STAFF]);

  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) throw new Error("Reservation not found.");

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: newStatus },
  });

  await AuditService.log({
    userId: session.userId,
    action: "RESERVATION_STATUS_UPDATED",
    entityType: "Reservation",
    entityId: id,
    details: {
      bookingRef: reservation.bookingRef,
      oldStatus: reservation.status,
      newStatus,
    },
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");

  return { success: true, reservation: updated };
}

export async function deleteReservationAction(id: string) {
  // ADMIN only
  const session = await requireAuth([UserRole.ADMIN]);

  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) throw new Error("Reservation not found.");

  await prisma.reservation.delete({ where: { id } });

  await AuditService.log({
    userId: session.userId,
    action: "RESERVATION_DELETED",
    entityType: "Reservation",
    entityId: id,
    details: { bookingRef: reservation.bookingRef },
  });

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");

  return { success: true };
}
