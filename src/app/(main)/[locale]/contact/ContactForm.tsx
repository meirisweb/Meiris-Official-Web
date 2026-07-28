"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { sendEmail } from "@/actions/sendEmail";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(8, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormProps = {
  heading: string;
  categories: string[];
  labels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
    submitBtn: string;
  };
  placeholders: {
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
  };
};

export default function ContactForm({ data }: { data?: FormProps }) {
  const [inquiryType, setInquiryType] = useState(data?.categories?.[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  if (!data) {
    return <div>Form data not found.</div>;
  }

  const { heading, categories, labels, placeholders } = data;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    formData.append("inquiryType", inquiryType);
    
    const botField = document.querySelector<HTMLInputElement>('#contact-form-page-bot');
    if (botField?.value) formData.append("bot-field", botField.value);

    const result = await sendEmail(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Thank you! Your message has been sent successfully.");
      form.reset();
    } else {
      toast.error(result.error || "Failed to submit. Please try again.");
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{labels?.phone}</label>
                    <FormControl>
                      <input type="tel" placeholder={placeholders?.phone} className="w-full bg-[#f9f9f9] rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500 font-medium text-xs" />
                  </FormItem>
                )}
              />
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
