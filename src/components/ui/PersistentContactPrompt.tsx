"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { sendEmail } from "@/actions/sendEmail";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  contactInfo: z.string().email({ message: "Please enter a valid email address." }),
  segment: z.string().min(2, { message: "Segment is required." }),
  preferredTime: z.string().optional(),
});

export default function PersistentContactPrompt({ segmentName }: { segmentName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeFadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIME = 8000; // 8 seconds
  const NUDGE_DISPLAY_TIME = 5000; // 5 seconds

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      contactInfo: "",
      segment: segmentName || "",
      preferredTime: "",
    },
  });

  // Update form default value if segmentName changes
  useEffect(() => {
    form.setValue("segment", segmentName);
  }, [segmentName, form]);

  const resetIdleTimer = () => {
    if (isOpen) return; // Don't show nudge if modal is open

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (nudgeFadeTimeoutRef.current) {
      clearTimeout(nudgeFadeTimeoutRef.current);
    }
    
    setShowNudge(false);
    
    idleTimeoutRef.current = setTimeout(() => {
      if (!isOpen) {
        setShowNudge(true);
        // Hide nudge after a few seconds
        nudgeFadeTimeoutRef.current = setTimeout(() => {
          setShowNudge(false);
        }, NUDGE_DISPLAY_TIME);
      }
    }, IDLE_TIME);
  };

  useEffect(() => {
    // Set up activity listeners
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    // Initial timer start
    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
      
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (nudgeFadeTimeoutRef.current) clearTimeout(nudgeFadeTimeoutRef.current);
    };
  }, [isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    
    // Add honeypot value manually if we were using a native form submission, 
    // but since we are using react-hook-form, we grab it from a ref or just let the form handle it.
    // Actually, it's easier to just pass the hidden field value if we add it to the DOM.
    // We'll get it from the DOM element.
    const botField = document.querySelector<HTMLInputElement>('input[name="bot-field"]');
    if (botField?.value) {
      formData.append("bot-field", botField.value);
    }

    const result = await sendEmail(formData);
    
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Thank you! Our expert will be in touch shortly.");
      setIsOpen(false);
      form.reset({ ...form.getValues(), name: "", contactInfo: "", preferredTime: "" });
    } else {
      toast.error(result.error || "Failed to submit. Please try again.");
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Nudge Tooltip */}
      <div 
        className={`absolute bottom-[72px] right-0 mb-4 bg-white text-black px-4 py-3 rounded-2xl shadow-xl border border-gray-100 w-max max-w-[220px] text-[13px] font-medium leading-tight transition-all duration-500 origin-bottom-right
          ${showNudge && !isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}
      >
        We can get in touch at your convenience.
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
      </div>

      {/* Expandable Form Modal */}
      <div 
        className={`absolute bottom-[72px] right-0 bg-white text-black rounded-[2rem] shadow-[0_12px_40px_rgb(0,0,0,0.15)] border border-gray-100 p-6 md:p-8 w-[calc(100vw-3rem)] max-w-[360px] sm:max-w-[400px] transition-all duration-500 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] md:text-[20px] font-bold">Contact an expert</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input {...field} type="text" placeholder="Full Name" className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-3.5 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input {...field} type="email" placeholder="Email address" className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-3.5 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input {...field} type="text" placeholder="Segment" className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-3.5 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input 
                      {...field} 
                      type="text" 
                      placeholder="Preferred time (optional)" 
                      onFocus={(e) => (e.target.type = "datetime-local")}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!e.target.value) e.target.type = "text";
                      }}
                      className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-3.5 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" 
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <button type="submit" disabled={isSubmitting} className="w-full mt-2 cursor-pointer bg-[#0a0a0a] text-white py-3.5 rounded-full text-[13px] font-bold shadow-lg hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Sending..." : "Talk to our expert"}
            </button>
          </form>
        </Form>
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNudge(false);
        }}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-[#00E573] text-black shadow-[0_8px_20px_rgba(0,229,115,0.4)] transition-transform duration-300 hover:scale-110 z-10`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} fill="currentColor" strokeWidth={1} />}
        {/* Subtle Pulse Ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border border-[#00E573] opacity-50 animate-[ping_3s_ease-in-out_infinite]"></div>
        )}
      </button>
    </div>
  );
}
