"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { sendEmail } from "@/actions/sendEmail";
import { trackContactSubmit } from "@/lib/analytics";
import { IntlPhoneInput } from "@/components/ui/IntlPhoneInput";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "getairmail.com",
  "dispostable.com",
  "fakeinbox.com",
  "maildrop.cc",
  "temp-mail.org",
  "test.com",
  "example.com",
  "fake.com",
  "spam.com",
  "asdf.com",
  "qwerty.com",
]);

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .refine(
      (val) => {
        const domain = val.split("@")[1]?.toLowerCase();
        return domain && !DISPOSABLE_DOMAINS.has(domain);
      },
      { message: "Please use a professional corporate email address (disposable emails are not allowed)." }
    ),
  countryCode: z.string().optional(),
  phone: z
    .string()
    .min(1, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
}).superRefine((data, ctx) => {
  if (data.phone) {
    let fullNumber = data.phone;
    if (data.countryCode && !fullNumber.startsWith("+")) {
      fullNumber = `${data.countryCode} ${data.phone}`;
    }
    const phoneNumber = parsePhoneNumberFromString(fullNumber, data.countryCode as any);
    if (!phoneNumber || !phoneNumber.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid phone number for the selected country.",
        path: ["phone"],
      });
    }
  }
});

const FORM_CATEGORIES = [
  "ELECTRIC VEHICLES",
  "BATTERY STORAGE",
  "AEROSPACE",
  "INDUSTRIAL POWER",
  "GENERAL INQUIRY",
];

const FORM_CONFIG = {
  heading: "TELL US WHAT YOU WANT TO SOLVE",
  labels: {
    name: "Your Name",
    company: "Company Name",
    email: "Email Address",
    phone: "Phone Number",
    message: "Project Details / How can we help?",
    submitBtn: "Send Inquiry",
  },
  placeholders: {
    name: "John Doe",
    company: "Siriem Mobility",
    email: "john@siriem.com",
    message: "Tell us about your power conversion requirements...",
  },
};

type FormProps = {
  heading?: string;
  categories?: string[];
  labels?: Partial<typeof FORM_CONFIG.labels>;
  placeholders?: Partial<typeof FORM_CONFIG.placeholders>;
};

export default function ContactForm({ data }: { data?: FormProps }) {
  const heading = data?.heading || FORM_CONFIG.heading;
  const categories = data?.categories?.length ? data.categories : FORM_CATEGORIES;
  const labels = { ...FORM_CONFIG.labels, ...data?.labels };
  const placeholders = { ...FORM_CONFIG.placeholders, ...data?.placeholders };

  const [inquiryType, setInquiryType] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      countryCode: "+91",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    formData.append("inquiryType", inquiryType);
    
    const botField = document.querySelector<HTMLInputElement>('#contact-form-page-bot');
    if (botField?.value) formData.append("bot-field", botField.value);

    // 1. Map fields and format the message body for the email template
    let formattedPhone = String(values.phone || "").trim();
    if (values.countryCode && !formattedPhone.startsWith("+")) {
      formattedPhone = `${values.countryCode} ${formattedPhone}`.trim();
    }

    const messageBody = `Inquiry Type: ${inquiryType}\nCompany: ${values.company || "Not provided"}\nPhone: ${formattedPhone}\n\nMessage:\n${values.message}`;
    
    formData.set("message", messageBody); // Overwrite the raw message with the formatted one
    formData.append("subject", `New Inquiry (${inquiryType}) from ${values.name || "Visitor"}`);

    // 2. Send email via Resend (validates on server internally)
    try {
      const submitResult = await sendEmail(formData);
      setIsSubmitting(false);

      if (!submitResult.success) {
        const errorMsg = submitResult.error || "Please check the form fields and try again.";
        setServerError(errorMsg);
        toast.error(errorMsg);
        if (submitResult.fieldErrors) {
          Object.entries(submitResult.fieldErrors).forEach(([field, msg]) => {
            form.setError(field as any, { type: "server", message: msg as string });
          });
        }
        return;
      }

      // Success
      trackContactSubmit({ source: "contact_page", formType: inquiryType });
      toast.success("Thank you! Your message has been sent successfully.");
      form.reset();
      setServerError(null);
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMsg = "We could not deliver your message automatically at this moment. Please email us directly at reachus@siriem.com.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  }

  return (
    <div className="flex flex-col items-center relative w-full">
      <h2 className="text-[1.75rem] font-bold text-black mb-12 self-start absolute left-0 top-0 hidden lg:block">{heading}</h2>
      <h2 className="text-[1.75rem] font-bold text-black mb-10 self-center lg:hidden">{heading}</h2>
      
      {/* Category Pills */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setInquiryType(cat)}
              className={`cursor-pointer px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 ${
                inquiryType === cat
                  ? "bg-[#00E573] text-black shadow-[0_0_18px_rgba(0,211,132,0.35)] scale-105"
                  : "bg-white text-black font-medium hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] hover:-translate-y-0.5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[800px] p-10 md:p-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="text" name="bot-field" id="contact-form-page-bot" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.name}</label>
                    <FormControl>
                      <input type="text" placeholder={placeholders?.name} className="w-full bg-[#f9f9f9] rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.company}</label>
                    <FormControl>
                      <input type="text" placeholder={placeholders?.company} className="w-full bg-[#f9f9f9] rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.email}</label>
                    <FormControl>
                      <input type="email" placeholder={placeholders?.email} className="w-full bg-[#f9f9f9] rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.phone}</label>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IntlPhoneInput
                          value={field.value}
                          onChange={(formatted) => field.onChange(formatted)}
                          onCountryChange={(dialCode) => {
                            form.setValue("countryCode", dialCode);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.message}</label>
                  <FormControl>
                    <textarea rows={5} placeholder={placeholders?.message} className="w-full bg-[#f9f9f9] rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] transition-all resize-none" {...field}></textarea>
                  </FormControl>
                  <FormMessage className="text-red-500 font-medium text-xs" />
                </FormItem>
              )}
            />

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-4 text-xs font-semibold flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex flex-col">
                  <p className="font-bold">Submission Error</p>
                  <p className="text-red-600/90 font-normal mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button type="submit" disabled={isSubmitting} className="cursor-pointer bg-[#0a0a0a] text-white px-8 py-4 rounded-full text-[12px] font-bold shadow-lg hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 tracking-wide disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? "Sending..." : labels?.submitBtn}
                <span>→</span>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
