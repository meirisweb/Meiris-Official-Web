"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { sendEmail } from "@/actions/sendEmail";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  cvFile: z.any()
    .refine((files) => files?.length === 1, "Please attach a CV/Resume.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf and .docx formats are supported."
    ),
});

export default function CareersForm({ locale }: { locale: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const cvFileValue = form.watch("cvFile");
  const fileName = cvFileValue?.[0]?.name;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'cvFile') {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value || "");
      }
    });

    const botField = document.querySelector<HTMLInputElement>('#careers-form-bot');
    if (botField?.value) formData.append("bot-field", botField.value);

    try {
      const result = await sendEmail(formData);
      if (result?.success) {
        toast.success("Thank you! Your application has been submitted.");
        form.reset();
      } else {
        toast.error(result?.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-10 md:p-12 shadow-2xl text-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <input type="text" name="bot-field" id="careers-form-bot" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">Full Name</label>
                  <FormControl>
                    <input type="text" placeholder="John Doe" className="w-full bg-transparent border border-black/20 rounded-md px-4 py-3.5 text-[13px] outline-none focus:border-[#00E573] transition-colors" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-medium text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">Email Address</label>
                  <FormControl>
                    <input type="email" placeholder="john@example.com" className="w-full bg-transparent border border-black/20 rounded-md px-4 py-3.5 text-[13px] outline-none focus:border-[#00E573] transition-colors" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500 font-medium text-xs" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="cvFile"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">Attach CV/Resume</label>
                <FormControl>
                  <div 
                    className="w-full border-[1.5px] border-dashed border-black/40 rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#f9f9f9] transition-colors relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        // @ts-ignore - assigning to readonly or mutable ref works
                        fileInputRef.current = e;
                      }}
                    />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E573" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span className="text-[13px] font-medium text-black">
                      {fileName ? fileName : "Drop file or click to browse"}
                    </span>
                    <span className="text-[9px] text-black/40 font-medium">PDF, DOCX (Max 10MB)</span>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full bg-[#0a0a0a] text-white py-4 rounded-full text-[12px] font-bold shadow-lg hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] transition-all duration-300 flex items-center justify-center gap-2 tracking-wide mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? "SENDING..." : (locale === 'es-419' ? 'ENVIAR SOLICITUD' : 'SUBMIT APPLICATION')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </form>
      </Form>
    </div>
  );
}
