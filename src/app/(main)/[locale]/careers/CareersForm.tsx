"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { validateContactForm } from "@/actions/sendEmail";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  cvFile: z
    .any()
    .refine((files) => files?.length === 1, "Please attach a CV/Resume.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 10MB.")
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf and .docx formats are supported."
    ),
});

export default function CareersForm({ locale }: { locale: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);

    const botField = document.querySelector<HTMLInputElement>("#careers-form-bot");
    if (botField?.value) formData.append("bot-field", botField.value);

    // 1. Run server-side spam and MX DNS validation
    const valResult = await validateContactForm(formData);
    if (!valResult.success) {
      setIsSubmitting(false);
      const errorMsg = valResult.error || "Please check the form fields and try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      if (valResult.fieldErrors) {
        Object.entries(valResult.fieldErrors).forEach(([field, msg]) => {
          if (field === "email" || field === "name") {
            form.setError(field as any, { type: "server", message: msg as string });
          }
        });
      }
      return;
    }

    // 2. Submit to Web3Forms directly from the browser (Client-Side) with FormData (handles file attachment!)
    try {
      const accessKey =
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
        "8104f760-2d45-4607-a202-8d3d5992582b";

      const submitData = new FormData();
      submitData.append("access_key", accessKey);
      submitData.append("subject", `New Inquiry (Careers Application) from ${values.name}`);
      submitData.append("replyto", values.email);
      submitData.append("name", values.name);
      submitData.append("email", values.email);

      if (values.cvFile && values.cvFile[0]) {
        submitData.append("attachment", values.cvFile[0]);
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData, // The browser sets multipart/form-data headers automatically for file attachments!
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok && result.success) {
        toast.success("Thank you! Your application has been submitted.");
        form.reset();
        setServerError(null);
      } else {
        const errorMsg =
          result.message ||
          "We could not submit your application at this time. Please try again later.";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMsg =
        "We could not deliver your application automatically at this moment. Please email us directly at reachus@siriem.com.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  }

  return (
    <div className="bg-white rounded-xl p-10 md:p-12 shadow-2xl text-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <input
            type="text"
            name="bot-field"
            id="careers-form-bot"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                    Full Name
                  </label>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-transparent border border-black/20 rounded-md px-4 py-3.5 text-[13px] outline-none focus:border-[#00E573] transition-colors"
                      {...field}
                    />
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
                  <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                    Email Address
                  </label>
                  <FormControl>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-transparent border border-black/20 rounded-md px-4 py-3.5 text-[13px] outline-none focus:border-[#00E573] transition-colors"
                      {...field}
                    />
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
                <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                  Attach CV/Resume
                </label>
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00E573"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span className="text-[13px] font-medium text-black">
                      {fileName ? fileName : "Drop file or click to browse"}
                    </span>
                    <span className="text-[9px] text-black/40 font-medium">
                      PDF, DOCX (Max 10MB)
                    </span>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-medium text-xs" />
              </FormItem>
            )}
          />

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-4 text-xs font-semibold flex items-start gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex flex-col">
                <p className="font-bold">Submission Error</p>
                <p className="text-red-600/90 font-normal mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-[#0a0a0a] text-white py-4 rounded-full text-[12px] font-bold shadow-lg hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] transition-all duration-300 flex items-center justify-center gap-2 tracking-wide mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "SENDING..."
              : locale === "es-419"
              ? "ENVIAR SOLICITUD"
              : "SUBMIT APPLICATION"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </form>
      </Form>
    </div>
  );
}
