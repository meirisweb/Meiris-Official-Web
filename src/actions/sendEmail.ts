"use server";

import { headers } from "next/headers";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/emails/ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  
  const data = Object.fromEntries(formData.entries());
  const name = String(data.name || "Unknown");
  const email = String(data.email || "");
  const message = String(data.message || "");
  const subject = data.subject ? String(data.subject) : `New Inquiry from ${name}`;

  let attachments = [];
  const attachment = formData.get("attachment") as File | null;
  if (attachment && attachment.size > 0) {
    const arrayBuffer = await attachment.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    attachments.push({
      filename: attachment.name,
      content: buffer,
    });
  }

  try {
    const { data: resData, error } = await resend.emails.send({
      from: "Meiris <onboarding@resend.dev>", // update to your verified domain later
      to: ["meirisweb@gmail.com"], // Must be your Resend account email for testing
      replyTo: email,
      subject: subject,
      react: ContactEmailTemplate({ name, email, message }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: "Failed to send email via Resend." };
    }

    // Auto-reply to applicant if it's a careers application
    if (subject.includes("Careers Application")) {
      try {
        const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: #0a0a0a;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.04);">
          <tr>
            <td align="center" style="background-color: #000000; padding: 30px;">
              <img src="https://siriem.com/logos/Meiris-Logo.png" alt="MEIRIS" width="200" style="display: block; border: none; outline: none; max-width: 100%; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="font-size: 22px; font-weight: bold; color: #000000; margin: 0 0 20px 0;">Application Received</h2>
              <p style="font-size: 15px; color: #555555; margin: 0 0 16px 0; line-height: 1.6;">Hi there,</p>
              <p style="font-size: 15px; color: #555555; margin: 0 0 16px 0; line-height: 1.6;">Thank you for applying to <strong>MEIRIS</strong>. We have successfully received your application and our team is currently reviewing it.</p>
              <p style="font-size: 15px; color: #555555; margin: 0 0 32px 0; line-height: 1.6;">If your profile matches our current requirements, we will reach out to you directly for the next steps.</p>
              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://siriem.com" style="background-color: #00D384; color: #000000; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 50px; display: inline-block;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #f9f9f9; padding: 30px; border-top: 1px solid #eeeeee;">
              <p style="font-size: 12px; color: #888888; margin: 0 0 20px 0;">
                Have questions? Contact us at <a href="mailto:reachus@siriem.com" style="color: #00D384; text-decoration: none;">reachus@siriem.com</a>
              </p>
              <p style="font-size: 11px; color: #aaaaaa; margin: 0;">This is an automated message. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await resend.emails.send({
          from: "MEIRIS Careers <careers@siriem.com>",
          to: [email],
          subject: "Application Received - MEIRIS",
          html: autoReplyHtml,
        });
      } catch (autoReplyErr) {
        console.error("Failed to send auto-reply to user:", autoReplyErr);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, error: "An unexpected error occurred while sending the email." };
  }
}
