import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { ContentService } from "@/services/ContentService";
import { NotificationService } from "@/services/NotificationService";

export const CreateReservationSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  customerEmail: z.string().email("Please provide a valid email address"),
  customerPhone: z.string().min(7, "Please provide a valid phone number").max(25),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  timeSlot: z.string().min(4, "Please choose a time slot"),
  partySize: z.coerce.number().int().min(1, "At least 1 guest required").max(12, "Maximum party size is 12"),
  seatingArea: z.enum(["PATIO", "MAIN", "COUNTER"]).default("MAIN"),
  specialRequest: z.string().max(500).optional(),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

export interface TimeSlotOption {
  time: string;
  group: "Sunset Dinner" | "Prime Evening" | "Late Night";
  isAvailable: boolean;
  remainingCapacity: number;
}

export class ReservationService {
  static async getAvailableSlots(
    dateStr: string,
    partySize: number
  ): Promise<TimeSlotOption[]> {
    const settings = await ContentService.getRestaurantSettings();

    // Standard dinner time slots
    const standardSlots: { time: string; group: "Sunset Dinner" | "Prime Evening" | "Late Night" }[] = [
      { time: "17:00", group: "Sunset Dinner" },
      { time: "17:30", group: "Sunset Dinner" },
      { time: "18:00", group: "Sunset Dinner" },
      { time: "18:30", group: "Sunset Dinner" },
      { time: "19:00", group: "Prime Evening" },
      { time: "19:30", group: "Prime Evening" },
      { time: "20:00", group: "Prime Evening" },
      { time: "20:30", group: "Prime Evening" },
      { time: "21:00", group: "Late Night" },
      { time: "21:30", group: "Late Night" },
      { time: "22:00", group: "Late Night" },
    ];

    const requestedDate = new Date(`${dateStr}T00:00:00.000Z`);

    // Fetch existing active bookings for this date
    const existingBookings = await prisma.reservation.findMany({
      where: {
        date: requestedDate,
        status: {
          notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
        },
      },
      select: {
        timeSlot: true,
        partySize: true,
      },
    });

    // Capacity per slot from restaurant settings (default: 40 guests)
    const slotCapacity = settings.capacityPerSlot;

    return standardSlots.map((slot) => {
      const bookingsForSlot = existingBookings.filter((b) => b.timeSlot === slot.time);
      const bookedGuests = bookingsForSlot.reduce((sum, b) => sum + b.partySize, 0);
      const remaining = Math.max(0, slotCapacity - bookedGuests);
      const isAvailable = remaining >= partySize;

      return {
        time: slot.time,
        group: slot.group,
        isAvailable,
        remainingCapacity: remaining,
      };
    });
  }

  static async createReservation(input: CreateReservationInput) {
    const parsed = CreateReservationSchema.parse(input);
    const settings = await ContentService.getRestaurantSettings();

    // 1. Verify future date & within maxDaysAhead
    const targetDate = new Date(`${parsed.date}T00:00:00.000Z`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      throw new Error("Reservations must be booked for future dates.");
    }

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + settings.maxDaysAhead);
    if (targetDate > maxDate) {
      throw new Error(
        `Reservations may only be booked up to ${settings.maxDaysAhead} days in advance.`
      );
    }

    // 2. Concurrency-Safe Transaction with Serializable Isolation
    const reservation = await prisma.$transaction(
      async (tx) => {
        // Query overlapping active reservations inside transaction
        const existingForSlot = await tx.reservation.findMany({
          where: {
            date: targetDate,
            timeSlot: parsed.timeSlot,
            status: {
              notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
            },
          },
          select: {
            partySize: true,
          },
        });

        const currentBooked = existingForSlot.reduce((sum, b) => sum + b.partySize, 0);
        if (currentBooked + parsed.partySize > settings.capacityPerSlot) {
          throw new Error(
            "This time slot just reached maximum dining capacity. Please select an adjacent time."
          );
        }

        // Generate unique booking reference (e.g., ELA-74921)
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const bookingRef = `ELA-${randomNum}`;

        return await tx.reservation.create({
          data: {
            bookingRef,
            customerName: parsed.customerName,
            customerEmail: parsed.customerEmail,
            customerPhone: parsed.customerPhone,
            date: targetDate,
            timeSlot: parsed.timeSlot,
            partySize: parsed.partySize,
            seatingArea: parsed.seatingArea,
            specialRequest: parsed.specialRequest || null,
            status: ReservationStatus.CONFIRMED,
          },
        });
      },
      {
        isolationLevel: "Serializable",
      }
    );

    // 3. Dispatch confirmation notification (async, non-blocking)
    try {
      await NotificationService.sendReservationConfirmation({
        bookingRef: reservation.bookingRef,
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        date: parsed.date,
        timeSlot: reservation.timeSlot,
        partySize: reservation.partySize,
        seatingArea: reservation.seatingArea,
      });
    } catch (err) {
      console.error("Non-blocking notification error:", err);
    }

    return reservation;
  }

  static async getReservationByRef(bookingRef: string) {
    return prisma.reservation.findUnique({
      where: { bookingRef },
    });
  }

  static async cancelReservation(bookingRef: string, customerEmail: string) {
    const existing = await prisma.reservation.findUnique({
      where: { bookingRef },
    });

    if (!existing) {
      throw new Error("Reservation not found.");
    }

    if (existing.customerEmail.toLowerCase() !== customerEmail.toLowerCase().trim()) {
      throw new Error("The provided email does not match this reservation reference.");
    }

    return prisma.reservation.update({
      where: { bookingRef },
      data: {
        status: ReservationStatus.CANCELLED,
      },
    });
  }
}
