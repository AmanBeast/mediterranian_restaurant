export class NotificationService {
  static async sendReservationConfirmation(reservation: {
    bookingRef: string;
    customerName: string;
    customerEmail: string;
    date: Date | string;
    timeSlot: string;
    partySize: number;
    seatingArea: string;
  }): Promise<{ sent: boolean; message: string }> {
    const apiKey = process.env.RESEND_API_KEY;

    const formattedDate =
      typeof reservation.date === "string"
        ? reservation.date
        : new Date(reservation.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });

    console.log(
      `[NotificationService] Sending confirmation for ${reservation.bookingRef} to ${reservation.customerEmail} (${formattedDate} at ${reservation.timeSlot})`
    );

    if (!apiKey) {
      return {
        sent: false,
        message: "Email skipped gracefully (RESEND_API_KEY not configured).",
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "reservations@elaia-table.com",
          to: reservation.customerEmail,
          subject: `Table Confirmed at Élaia: ${reservation.bookingRef}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0C100D; color: #F3EEE7; padding: 32px; border-radius: 16px;">
              <h1 style="color: #FAB44D; margin-bottom: 8px;">Élaia Mediterranean Table</h1>
              <p style="color: #D47D57; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Reservation Confirmed</p>
              <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              <p>Dear ${reservation.customerName},</p>
              <p>We are delighted to confirm your upcoming reservation with us.</p>
              <div style="background: #18221B; padding: 20px; border-radius: 12px; margin: 24px 0;">
                <p style="margin: 4px 0;"><strong>Reference:</strong> ${reservation.bookingRef}</p>
                <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${reservation.timeSlot}</p>
                <p style="margin: 4px 0;"><strong>Party Size:</strong> ${reservation.partySize} Guests</p>
                <p style="margin: 4px 0;"><strong>Seating Area:</strong> ${reservation.seatingArea}</p>
                <p style="margin: 4px 0;"><strong>Location:</strong> 428 Coastal Vista Way, Marina Promenade</p>
              </div>
              <p style="font-size: 12px; color: #A8A29E;">If your schedule changes, please notify our hospitality concierge at +1 (800) 555-3524 at least 4 hours prior.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API response error:", errorText);
        return { sent: false, message: "Email delivery failed via Resend API." };
      }

      return { sent: true, message: "Email dispatched successfully." };
    } catch (err) {
      console.error("Resend notification error:", err);
      return { sent: false, message: "Network error during email dispatch." };
    }
  }
}
