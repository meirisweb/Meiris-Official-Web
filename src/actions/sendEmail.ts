"use server";

import { headers } from "next/headers";

// Simple In-Memory Rate Limiter (Note: In a multi-instance edge deployment like Vercel, 
// this is per-instance, but it is sufficient for basic anti-spam without Redis).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // Max 5 submissions
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function sendEmail(formData: FormData) {
  try {
    // 1. Honeypot Check (Anti-Bot)
    const honeypot = formData.get("bot-field");
    if (honeypot) {
      // Silently accept it so bots think they succeeded, but do nothing.
      console.log("Bot detected via honeypot field. Discarding.");
      return { success: true };
    }

    // 2. Rate Limiting
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit) {
      if (now - userLimit.lastReset > WINDOW_MS) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, lastReset: now });
      } else {
        if (userLimit.count >= RATE_LIMIT) {
          console.warn(`Rate limit exceeded for IP: ${ip}`);
          return { success: false, error: "Too many submissions. Please try again later." };
        }
        rateLimitMap.set(ip, { count: userLimit.count + 1, lastReset: userLimit.lastReset });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    // 3. Process the Data
    // We convert FormData to a plain object for logging/sending
    const data = Object.fromEntries(formData.entries());
    
    // NOTE: This is where you would integrate Resend or Nodemailer.
    // e.g. await resend.emails.send({ ... })
    // Since no provider was explicitly chosen yet, we mock the success.
    console.log("Mock Email Sent Successfully. Payload:", data);

    // Artificial delay to simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Error processing form:", error);
    return { success: false, error: "Failed to submit form. Please try again." };
  }
}
