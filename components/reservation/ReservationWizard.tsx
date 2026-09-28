"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  checkSlotAvailability,
  submitReservationAction,
} from "@/actions/reservation";
import type { TimeSlotOption } from "@/services/ReservationService";

interface DateOption {
  dayName: string;
  dayNum: string;
  monthName: string;
  fullDate: string; // YYYY-MM-DD
  label: string;
}

const SEATING_OPTIONS = [
  {
    id: "PATIO",
    title: "Pergola Garden Patio",
    description: "Sunlit terrace shaded by olive trees, bougainvillea breeze & soft acoustic melodies.",
    tag: "Popular",
    features: ["Sunset Views", "Heated Canopy"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaBn6-prF5Q5JFymaOjsQiu0Qpx_rtA5T1-V5EuSXIiaTr3K8a1pAk9GiaV8oG3ChvQXikVwm4KlYD8n7c2eIRz5eGb8-D1cQvfl9mWrx0y5J0j_8ZjsA1X3ZOOkAdzqxSow4CKHwU_n-3bFy2yHK_rJxOB6ns7pQPLBnL3e98TdZAekyKic22p3hfKgT2I2ja9afzrIK8XGiGINP4HEGMis-eSTFVfm6piuuNNjbc-kF1Oiynibpg2w",
  },
  {
    id: "MAIN",
    title: "Main Dining Salon",
    description: "Near the wood-fire hearth with limestone archways, linen drapery & wine vault views.",
    tag: "Hearthside",
    features: ["Aged Limestone", "Intimate Glow"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANG6PJnVyGwfcw2O_8okEnT_ZK5JK56hZVMLkhpNax1HLgG-oBmUgWvp_j7xy1yhcTCiD1IFnMzsr0ns28WlpUNpVZKdXRPu1rn9yYQlqTPqOtETftE3kQNmqH7xFfJ82kKNzRZDlBlHLp67Wou5iaBz455MTZS-AaM0dlXVpePuX2SE7fWBooK7nkcaJIrL8L0JwBl0DupP5HUUITrfRZr6wFoJYgfhbCJ0xFkWmE6F742uk9EdXiNA",
  },
  {
    id: "COUNTER",
    title: "Chef's Hearth Counter",
    description: "Front-row seats to open flame grilling, curated pairings & direct chef conversation.",
    tag: "Tasting Experience",
    features: ["Live Kitchen", "Chef Pairing"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDN3Ff3YZ7n7vPcTUT-FtwIQ5_qxskVFvvZBHmmJpNXPa47GDe8YgAnsKcSJRPa0-P5Q604R8sq2Ze2r13hx0nHNK1ajnRd0tfStEJlRcPZ-oaPn5Y3XIo8wjfEFsNBau8dcIE2SqFNxg9AIJyHdX96Yg39dV-oA6e2cyJ5i0indLjE_R3VGUVecigqEPffD8wKgpdiTEY7c86GQ_iiME9aOqKaFtKHo-c62CD3dxaUZHvTyxv6PpJn8w",
  },
];

export function ReservationWizard() {
  // Generate next 14 days
  const dateOptions: DateOption[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1)); // start tomorrow
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const fullDate = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = String(d.getDate());

    let label = "";
    if (i === 0) label = "Tomorrow";
    else if (d.getDay() === 0 || d.getDay() === 6) label = "Weekend";
    else label = "Open";

    return { dayName, dayNum, monthName, fullDate, label };
  });

  // State
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].fullDate);
  const [partySize, setPartySize] = useState<number>(2);
  const [seatingArea, setSeatingArea] = useState<string>("PATIO");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [specialRequest, setSpecialRequest] = useState<string>("");

  const [availableSlots, setAvailableSlots] = useState<TimeSlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Load available slots when date or partySize changes
  useEffect(() => {
    let isCancelled = false;
    setSlotsLoading(true);
    setSelectedSlot("");
    setErrorMessage("");

    checkSlotAvailability(selectedDate, partySize)
      .then((res) => {
        if (!isCancelled && res.success && res.slots) {
          setAvailableSlots(res.slots);
          // Auto select first available slot
          const firstAvail = res.slots.find((s) => s.isAvailable);
          if (firstAvail) setSelectedSlot(firstAvail.time);
        }
      })
      .finally(() => {
        if (!isCancelled) setSlotsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, partySize]);

  // Handle Booking Submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedSlot) {
      setErrorMessage("Please select a dining time slot.");
      return;
    }

    startTransition(async () => {
      const res = await submitReservationAction({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        date: selectedDate,
        timeSlot: selectedSlot,
        partySize,
        seatingArea: seatingArea as "PATIO" | "MAIN" | "COUNTER",
        specialRequest,
      });

      if (res.success && res.reservation) {
        setBookingConfirmed(res.reservation);
      } else {
        setErrorMessage(res.error || "Failed to confirm reservation.");
      }
    });
  };

  // Generate .ics calendar download
  const downloadIcs = () => {
    if (!bookingConfirmed) return;
    const [hours, minutes] = bookingConfirmed.timeSlot.split(":").map(Number);
    const dateParts = bookingConfirmed.date.split("-").map(Number);

    const start = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes));
    const end = new Date(start.getTime() + 90 * 60 * 1000); // 90 min

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatIcsTime = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Élaia Mediterranean Table//Reservations//EN",
      "BEGIN:VEVENT",
      `UID:${bookingConfirmed.bookingRef}@elaia-table.com`,
      `DTSTAMP:${formatIcsTime(new Date())}`,
      `DTSTART:${formatIcsTime(start)}`,
      `DTEND:${formatIcsTime(end)}`,
      `SUMMARY:Dinner at Élaia Mediterranean Table (${bookingConfirmed.bookingRef})`,
      `DESCRIPTION:Table reserved for ${bookingConfirmed.partySize} guests in ${bookingConfirmed.seatingArea}. Reference: ${bookingConfirmed.bookingRef}.`,
      "LOCATION:428 Coastal Vista Way, Marina Promenade, Waterfront District",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `elaia-reservation-${bookingConfirmed.bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SUCCESS CONFIRMATION VIEW
  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-white/10 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#18221B] border-2 border-[#FAB44D] text-[#FAB44D] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>

        <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
          Reservation Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3EEE7] mt-1 mb-2">
          We Await Your Arrival
        </h1>
        <p className="text-xs sm:text-sm text-[#DED7CB]/80 max-w-md mx-auto mb-8 font-light">
          Your table is secured. An email summary with dining details has been sent to{" "}
          <strong className="text-[#F3EEE7]">{bookingConfirmed.customerEmail}</strong>.
        </p>

        {/* Booking Card Details */}
        <div className="bg-[#0C100D] rounded-2xl p-6 border border-white/10 text-left mb-8 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-[#DED7CB]/60 uppercase tracking-wider">
              Booking Reference
            </span>
            <span className="font-mono text-base font-bold text-[#FAB44D]">
              {bookingConfirmed.bookingRef}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#DED7CB]/60 block mb-0.5">Date</span>
              <span className="font-semibold text-[#F3EEE7] text-sm">
                {bookingConfirmed.date}
              </span>
            </div>
            <div>
              <span className="text-[#DED7CB]/60 block mb-0.5">Time</span>
              <span className="font-semibold text-[#F3EEE7] text-sm">
                {bookingConfirmed.timeSlot}
              </span>
            </div>
            <div>
              <span className="text-[#DED7CB]/60 block mb-0.5">Party Size</span>
              <span className="font-semibold text-[#F3EEE7] text-sm">
                {bookingConfirmed.partySize} Guests
              </span>
            </div>
            <div>
              <span className="text-[#DED7CB]/60 block mb-0.5">Atmosphere</span>
              <span className="font-semibold text-[#FAB44D] text-sm">
                {bookingConfirmed.seatingArea}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadIcs}
            className="w-full sm:w-auto h-11 px-6 bg-[#D47D57] hover:bg-[#B25337] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Add to Calendar (.ics)</span>
          </button>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto h-11 px-6 glass-obsidian hover:bg-white/10 text-[#F3EEE7] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            <span>Get Directions</span>
          </a>

          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-6 glass-obsidian hover:bg-white/10 text-[#DED7CB] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // WIZARD BOOKING FLOW
  return (
    <form onSubmit={handleSubmitBooking} className="max-w-3xl mx-auto flex flex-col gap-8">
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl text-xs font-medium bg-red-950/70 border border-red-500/40 text-red-200"
        >
          {errorMessage}
        </div>
      )}

      {/* Step 1: Date Selector Carousel */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#D47D57]">
              calendar_today
            </span>
            1. Select Dining Date
          </span>
          <span className="text-xs text-[#DED7CB]/60">Select from next 14 days</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {dateOptions.map((opt) => {
            const isSelected = selectedDate === opt.fullDate;
            return (
              <button
                key={opt.fullDate}
                type="button"
                onClick={() => setSelectedDate(opt.fullDate)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center w-[76px] py-3 rounded-2xl transition-all duration-200 active:scale-95 border",
                  isSelected
                    ? "bg-[#D47D57] text-white border-[#D47D57] glow-terracotta shadow-lg scale-105"
                    : "glass-obsidian border-white/5 text-[#DED7CB] hover:bg-white/5"
                )}
              >
                <span className="text-[11px] opacity-75 font-medium">{opt.dayName}</span>
                <span className="font-serif text-lg font-bold mt-0.5">{opt.dayNum}</span>
                <span
                  className={cn(
                    "text-[10px] mt-0.5 font-medium",
                    isSelected ? "text-white" : "text-[#FAB44D]"
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Party Size */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#D47D57]">
              group
            </span>
            2. Number of Guests
          </span>
          <span className="text-xs text-[#DED7CB]/60">Tables held for 2 hours</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const isSelected = partySize === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setPartySize(num)}
                className={cn(
                  "h-11 rounded-xl font-serif text-sm font-semibold transition-all active:scale-95 border",
                  isSelected
                    ? "bg-[#D47D57] text-white border-[#D47D57] glow-terracotta shadow-md"
                    : "glass-obsidian border-white/5 text-[#DED7CB] hover:bg-white/5"
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Atmosphere & Seating Area */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#D47D57]">
              deck
            </span>
            3. Atmosphere & Seating Preference
          </span>
          <span className="text-xs text-[#DED7CB]/60">Tap to choose ambiance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEATING_OPTIONS.map((opt) => {
            const isSelected = seatingArea === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSeatingArea(opt.id)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between group",
                  isSelected
                    ? "glass-obsidian border-[#FAB44D] bg-[#18221B]/90 shadow-xl"
                    : "glass-card border-white/5 hover:border-white/20"
                )}
              >
                <div>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-[#0C100D]">
                    <Image
                      src={opt.imageUrl}
                      alt={opt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-[#D47D57] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                      {opt.tag}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-base font-bold text-[#F3EEE7]">
                      {opt.title}
                    </h3>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center text-[12px]",
                        isSelected
                          ? "bg-[#FAB44D] border-[#FAB44D] text-[#0C100D]"
                          : "border-white/30 text-transparent"
                      )}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#DED7CB]/75 leading-relaxed font-light mb-3">
                    {opt.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#FAB44D]/90 pt-2 border-t border-white/5">
                  {opt.features.join(" • ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 4: Available Time Slots */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#D47D57]">
              schedule
            </span>
            4. Available Time Slots
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Table Inventory
          </span>
        </div>

        {slotsLoading ? (
          <div className="glass-obsidian rounded-2xl p-8 text-center text-xs text-[#DED7CB]/70">
            Checking real-time table availability...
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="glass-obsidian rounded-2xl p-6 text-center text-xs text-[#DED7CB]/70">
            No tables available for this party size on the selected date. Please choose another date.
          </div>
        ) : (
          <div className="space-y-4">
            {["Sunset Dinner", "Prime Evening", "Late Night"].map((groupName) => {
              const groupSlots = availableSlots.filter((s) => s.group === groupName);
              if (groupSlots.length === 0) return null;

              return (
                <div key={groupName} className="glass-card rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-serif font-bold text-[#F3EEE7] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#FAB44D]">
                        {groupName === "Sunset Dinner"
                          ? "wb_twilight"
                          : groupName === "Prime Evening"
                          ? "nights_stay"
                          : "bedtime"}
                      </span>
                      {groupName}
                    </span>
                    {groupName === "Prime Evening" && (
                      <span className="text-[10px] text-[#D47D57] font-semibold uppercase tracking-wider bg-[#D47D57]/20 px-2 py-0.5 rounded-full">
                        Peak Demand
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {groupSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={cn(
                            "py-2.5 px-3 rounded-xl font-mono text-xs font-semibold transition-all active:scale-95 border",
                            isSelected
                              ? "bg-[#D47D57] text-white border-[#D47D57] glow-terracotta shadow-md"
                              : slot.isAvailable
                              ? "glass-obsidian border-white/5 text-[#F3EEE7] hover:bg-white/10"
                              : "opacity-30 border-white/5 text-[#DED7CB]/40 cursor-not-allowed"
                          )}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 5: Guest Contact Details */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col gap-4">
        <span className="text-xs uppercase tracking-widest text-[#FAB44D] font-semibold">
          5. Guest Contact Details
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexandria Morgan"
              className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1">
              Email Address (for confirmation) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexandria@example.com"
              className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#DED7CB]/70 block mb-1">
              Special Requests / Dietary Notes (Optional)
            </label>
            <input
              type="text"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Anniversary, seafood allergy, quiet corner..."
              className="w-full h-11 px-4 rounded-xl bg-[#0C100D] border border-white/10 text-sm text-[#F3EEE7] placeholder-[#DED7CB]/30 focus:outline-none focus:border-[#FAB44D]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedSlot || slotsLoading}
          className="mt-4 w-full h-12 bg-[#D47D57] hover:bg-[#B25337] disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 glow-terracotta shadow-lg transition-all active:scale-95"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Securing Your Table...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Confirm Table Reservation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
