"use server";

import { ReservationService, type CreateReservationInput } from "@/services/ReservationService";

export type ReservationResult = {
  success: boolean;
  reservation?: any;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function checkSlotAvailability(dateStr: string, partySize: number) {
  try {
    const slots = await ReservationService.getAvailableSlots(dateStr, partySize);
    return { success: true, slots };
  } catch (error: any) {
    console.error("Availability check error:", error);
    return { success: false, error: error.message || "Failed to calculate slot availability." };
  }
}

export async function submitReservationAction(
  data: CreateReservationInput
): Promise<ReservationResult> {
  try {
    const reservation = await ReservationService.createReservation(data);
    return {
      success: true,
      reservation: {
        id: reservation.id,
        bookingRef: reservation.bookingRef,
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        date: data.date,
        timeSlot: reservation.timeSlot,
        partySize: reservation.partySize,
        seatingArea: reservation.seatingArea,
      },
    };
  } catch (err: any) {
    console.error("Reservation creation error:", err);
    return {
      success: false,
      error: err.message || "Could not complete reservation at this time.",
    };
  }
}
