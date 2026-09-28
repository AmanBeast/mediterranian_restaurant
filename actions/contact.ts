"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(30).optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = ContactSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, subject, message } = parsed.data;

  try {
    // Database-backed serverless rate limiting: max 5 messages per email in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.contactMessage.count({
      where: {
        email,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentCount >= 5) {
      return {
        success: false,
        message:
          "You have submitted multiple messages recently. Please allow some time before sending another inquiry.",
      };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    return {
      success: true,
      message:
        "Thank you for contacting Élaia. Our hospitality concierge will respond to your inquiry shortly.",
    };
  } catch (error) {
    console.error("Contact message error:", error);
    return {
      success: false,
      message:
        "We experienced a temporary error while receiving your message. Please call us directly.",
    };
  }
}
