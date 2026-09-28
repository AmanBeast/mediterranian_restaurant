import { describe, it, expect, afterAll } from "vitest";
import { ReservationService } from "@/services/ReservationService";
import { prisma } from "@/lib/prisma";

describe("ReservationService Integration & Concurrency Suite", () => {
  // Use a date 5 days into the future (within maxDaysAhead limit)
  const target = new Date();
  target.setDate(target.getDate() + 5);
  const testDate = target.toISOString().split("T")[0];

  const testTime = "21:30";
  const createdBookingRefs: string[] = [];

  afterAll(async () => {
    // Clean up test bookings
    if (createdBookingRefs.length > 0) {
      await prisma.reservation.deleteMany({
        where: {
          bookingRef: { in: createdBookingRefs },
        },
      });
    }
  });

  it("should calculate available slots for a future date", async () => {
    const slots = await ReservationService.getAvailableSlots(testDate, 2);
    expect(slots.length).toBeGreaterThan(0);

    const firstSlot = slots[0];
    expect(firstSlot).toHaveProperty("time");
    expect(firstSlot).toHaveProperty("group");
    expect(firstSlot).toHaveProperty("isAvailable");
    expect(firstSlot.isAvailable).toBe(true);
  });

  it("should reject bookings in the past", async () => {
    await expect(
      ReservationService.createReservation({
        customerName: "Time Traveler",
        customerEmail: "past@example.com",
        customerPhone: "+15551234567",
        date: "2020-01-01",
        timeSlot: "19:00",
        partySize: 2,
        seatingArea: "MAIN",
      })
    ).rejects.toThrow("Reservations must be booked for future dates.");
  });

  it("should reject party size exceeding maximum allowed (12)", async () => {
    await expect(
      ReservationService.createReservation({
        customerName: "Huge Party",
        customerEmail: "huge@example.com",
        customerPhone: "+15551234567",
        date: testDate,
        timeSlot: "19:00",
        partySize: 25,
        seatingArea: "MAIN",
      })
    ).rejects.toThrow();
  });

  it("should atomically handle concurrent requests for the final available capacity", async () => {
    // 1. Fill the slot up to capacityPerSlot - 2 (38 out of 40)
    const baseFiller = await ReservationService.createReservation({
      customerName: "Base Filler Guest",
      customerEmail: "filler@example.com",
      customerPhone: "+15559990000",
      date: testDate,
      timeSlot: testTime,
      partySize: 12, // fills 12
      seatingArea: "MAIN",
    });
    createdBookingRefs.push(baseFiller.bookingRef);

    const filler2 = await ReservationService.createReservation({
      customerName: "Filler 2",
      customerEmail: "filler2@example.com",
      customerPhone: "+15559990001",
      date: testDate,
      timeSlot: testTime,
      partySize: 12, // 24 total
      seatingArea: "MAIN",
    });
    createdBookingRefs.push(filler2.bookingRef);

    const filler3 = await ReservationService.createReservation({
      customerName: "Filler 3",
      customerEmail: "filler3@example.com",
      customerPhone: "+15559990002",
      date: testDate,
      timeSlot: testTime,
      partySize: 12, // 36 total
      seatingArea: "MAIN",
    });
    createdBookingRefs.push(filler3.bookingRef);

    const filler4 = await ReservationService.createReservation({
      customerName: "Filler 4",
      customerEmail: "filler4@example.com",
      customerPhone: "+15559990003",
      date: testDate,
      timeSlot: testTime,
      partySize: 2, // 38 total -> only 2 seats remaining out of 40!
      seatingArea: "MAIN",
    });
    createdBookingRefs.push(filler4.bookingRef);

    // Now only 2 seats are left in capacity of 40!
    // We launch TWO concurrent requests, each asking for 2 seats simultaneously.
    // Concurrency guarantee: Exactly ONE must succeed and ONE must fail.
    const req1 = ReservationService.createReservation({
      customerName: "Concurrent Runner A",
      customerEmail: "runnerA@example.com",
      customerPhone: "+15551112222",
      date: testDate,
      timeSlot: testTime,
      partySize: 2,
      seatingArea: "PATIO",
    });

    const req2 = ReservationService.createReservation({
      customerName: "Concurrent Runner B",
      customerEmail: "runnerB@example.com",
      customerPhone: "+15553334444",
      date: testDate,
      timeSlot: testTime,
      partySize: 2,
      seatingArea: "PATIO",
    });

    const results = await Promise.allSettled([req1, req2]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    // Exactly one must succeed and one must fail
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    if (fulfilled[0].status === "fulfilled") {
      createdBookingRefs.push((fulfilled[0] as any).value.bookingRef);
    }

    // Verify slot is now completely booked (0 remaining for 2 guests)
    const slotsAfter = await ReservationService.getAvailableSlots(testDate, 2);
    const testSlotAfter = slotsAfter.find((s) => s.time === testTime);
    expect(testSlotAfter?.isAvailable).toBe(false);
  });
});
