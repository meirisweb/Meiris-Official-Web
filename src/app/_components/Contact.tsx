"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { sendEmail } from "@/actions/sendEmail";
import { trackContactSubmit } from '@/lib/analytics';
import { IntlPhoneInput } from '@/components/ui/IntlPhoneInput';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import styles from './Contact.module.css';

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com",
  "yopmail.com", "throwawaymail.com", "sharklasers.com", "getairmail.com",
  "dispostable.com", "fakeinbox.com", "maildrop.cc", "temp-mail.org",
  "test.com", "example.com", "fake.com", "spam.com", "asdf.com", "qwerty.com",
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

export default function Contact({ data }: { data: any }) {
  const sectionRef = useRef(null);
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
    
    const botField = document.querySelector<HTMLInputElement>('#contact-form-bot');
    if (botField?.value) formData.append("bot-field", botField.value);

    let formattedPhone = String(values.phone || "").trim();
    if (values.countryCode && !formattedPhone.startsWith("+")) {
      formattedPhone = `${values.countryCode} ${formattedPhone}`.trim();
    }

    const messageBody = `Company: ${values.company || "Not provided"}\nPhone: ${formattedPhone}\n\nMessage:\n${values.message}`;
    formData.set("message", messageBody);

    // Send email (and validate) on server via Resend
    formData.append("subject", `New Inquiry (Home Page Contact) from ${values.name}`);
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
      trackContactSubmit({ source: "home_page_contact", formType: "general" });
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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        entries[0].target.classList.add(styles.visible);
        observer.unobserve(entries[0].target);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.contactSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.contactBox}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{data.heading}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
                <input type="text" name="bot-field" id="contact-form-bot" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className={styles.inputGroup}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <input type="text" placeholder={data.namePlaceholder || "Your Name"} className={styles.input} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <input type="text" placeholder="Company Name" className={styles.input} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <input type="email" placeholder={data.emailPlaceholder || "Email Address"} className={styles.input} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <IntlPhoneInput
                            value={field.value}
                            onChange={(formatted) => field.onChange(formatted)}
                            onCountryChange={(dialCode) => {
                              form.setValue("countryCode", dialCode);
                            }}
                            className={styles.intlPhoneWrapper}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <textarea placeholder={data.messagePlaceholder || "Project Details / How can we help?"} className={styles.textarea} rows={4} {...field}></textarea>
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-3 text-xs font-semibold flex items-start gap-2.5 my-2">
                    <svg className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className={`${styles.submitBtn} disabled:opacity-70 disabled:cursor-not-allowed`}>
                  {isSubmitting ? "Sending..." : data.submitBtn || "Send Message"}
                  <span className={styles.arrow}>→</span>
                </button>
              </form>
            </Form>
          </div>
          <div className={styles.imageContent}>
            <Image src={data.imageUrl || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Contact" fill className={styles.image} sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
