"use server";

import { headers } from "next/headers";
import { isValidPhoneNumber } from "libphonenumber-js";

// Simple In-Memory Rate Limiter (Note: In a multi-instance edge deployment like Vercel, 
// this is per-instance, but it is sufficient for basic anti-spam without Redis).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // Max 5 submissions per IP
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Blacklist of disposable/temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "throwawaymail.com",
  "getnada.com",
  "temp-mail.org",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "trashmail.com",
]);

export async function validateContactForm(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    // 1. Basic Bot Prevention
    const botField = formData.get("bot-field");
    if (botField) {
      console.warn("Honeypot field triggered. Aborting submission.");
      return { success: false, error: "Invalid submission detected." };
    }

    // 2. Rate Limiting Check
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "anonymous";

    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit) {
      if (now - userLimit.lastReset > WINDOW_MS) {
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
    const data = Object.fromEntries(formData.entries());

    // 3a. Email verification: check against disposable domains and verify MX records via DNS over HTTPS
    const emailStr = String(data.email || data.orgContact || data.contactInfo || "").trim().toLowerCase();
    const emailDomain = emailStr.split("@")[1];

    if (!emailDomain || DISPOSABLE_DOMAINS.has(emailDomain)) {
      return {
        success: false,
        error: "Please provide a valid professional or corporate email address (disposable/fake emails are not allowed).",
        fieldErrors: {
          email: "Please provide a valid professional or corporate email address (disposable/fake emails are not allowed).",
          orgContact: "Please provide a valid professional or corporate email address (disposable/fake emails are not allowed).",
          contactInfo: "Please provide a valid professional or corporate email address (disposable/fake emails are not allowed).",
        },
      };
    }

    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(emailDomain)}&type=MX`,
        { cache: "no-store" }
      );
      const dnsData = await res.json();

      if (!dnsData.Answer || dnsData.Answer.length === 0) {
        return {
          success: false,
          error: `The email domain "@${emailDomain}" does not appear to have valid mail servers. Please check your email address.`,
          fieldErrors: {
            email: `The email domain "@${emailDomain}" does not appear to have valid mail servers. Please check your email address.`,
            orgContact: `The email domain "@${emailDomain}" does not appear to have valid mail servers. Please check your email address.`,
            contactInfo: `The email domain "@${emailDomain}" does not appear to have valid mail servers. Please check your email address.`,
          },
        };
      }
    } catch (dnsErr: any) {
      console.warn(`[DNS lookup warning] Could not check MX via Google DNS for ${emailDomain}:`, dnsErr?.message);
    }

    // 3b. Validate phone number
    const rawPhone = String(data.phone || "").trim();
    const dialCode = String(data.countryCode || "").trim();
    if (rawPhone) {
      try {
        let phoneToTest = rawPhone;
        if (!phoneToTest.startsWith("+") && dialCode) {
          phoneToTest = `${dialCode} ${phoneToTest}`.trim();
        }
        if (!isValidPhoneNumber(phoneToTest)) {
          return {
            success: false,
            error: "The phone number you entered appears to be invalid for the selected country. Please check the digits.",
            fieldErrors: {
              phone: "The phone number you entered appears to be invalid for the selected country. Please check the digits.",
            },
          };
        }
      } catch {
        // ignore parse error
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error validating contact form:", error);
    return { success: false, error: "Validation failed. Please try again." };
  }
}

export async function sendEmail(formData: FormData) {
  const validation = await validateContactForm(formData);
  if (!validation.success) {
    return validation;
  }
  return { success: true };
}
