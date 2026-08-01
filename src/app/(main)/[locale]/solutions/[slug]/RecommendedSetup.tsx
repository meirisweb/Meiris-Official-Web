"use client";
import React, { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { sendEmail, validateContactForm } from "@/actions/sendEmail";

import solCharge from "@/assets/sol-charge.jpg";
import solDepot from "@/assets/sol-depot.jpg";
import solCustom from "@/assets/sol-custom.jpg";
import solHospitality from "@/assets/sol-hospitality.jpg";
import solResidential from "@/assets/sol-residential.jpg";

const LOCAL_IMAGES: Record<string, any> = {
  solCharge,
  solDepot,
  solCustom,
  solHospitality,
  solResidential,
};

type Feature = {
  title: string;
  image?: any;
  imageUrl?: string;
  localImageRef?: string;
  text: string;
};

type Fleet = {
  id: string;
  label: string;
  features: Feature[];
};



const formSchema = z.object({
  appDomain: z.string().min(2, { message: "Application domain is required." }),
  powerRating: z.string().min(2, { message: "Power rating is required." }),
  constraints: z.string().optional(),
  orgContact: z.string().email({ message: "Please enter a valid email address." }),
  timeline: z.string().min(2, { message: "Timeline is required." }),
});

export default function RecommendedSetup({ setupData }: { setupData?: any }) {
  const [activeTab, setActiveTab] = useState("bus");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      appDomain: "",
      powerRating: "",
      constraints: "",
      orgContact: "",
      timeline: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    
    const botField = document.querySelector<HTMLInputElement>('#setup-form-bot');
    if (botField?.value) formData.append("bot-field", botField.value);

    // 1. Run server-side spam & MX DNS validation (over Google DNS HTTPS)
    const valResult = await validateContactForm(formData);
    if (!valResult.success) {
      setIsSubmitting(false);
      const errorMsg = valResult.error || "Please check the form fields and try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      if (valResult.fieldErrors) {
        Object.entries(valResult.fieldErrors).forEach(([field, msg]) => {
          if (field === "email" || field === "orgContact") {
            form.setError("orgContact" as any, { type: "server", message: msg as string });
          }
        });
      }
      return;
    }

    // 2. Submit to Web3Forms directly from the browser (Client-Side) to avoid Free Plan 403 blocks
    try {
      const accessKey =
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
        "8104f760-2d45-4607-a202-8d3d5992582b";

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Inquiry (${values.appDomain || "Solutions Page"}) from ${values.orgContact}`,
          replyto: values.orgContact,
          email: values.orgContact,
          "Application Domain": values.appDomain,
          "Power Rating": values.powerRating,
          "Constraints": values.constraints || "None specified",
          "Timeline": values.timeline,
        }),
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok && result.success) {
        toast.success("Thank you! Our expert will be in touch shortly.");
        form.reset();
        setServerError(null);
      } else {
        const errorMsg = result.message || "We could not submit your request at this time. Please try again later.";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMsg = "We could not deliver your request automatically at this moment. Please email us directly at reachus@siriem.com.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  }

  // Determine which features to show
  let featuresToDisplay: Feature[] = [];
  let showTabs = false;
  let fleetsData: any[] = setupData?.fleetsSetup || [];

  if (setupData?.setupForm) {
    showTabs = false;
  } else if (setupData?.setupFeaturesOnly && setupData.setupFeaturesOnly.length > 0) {
    featuresToDisplay = setupData.setupFeaturesOnly.map((feat: any) => ({
      ...feat,
      image: feat.imageUrl || (feat.localImageRef && LOCAL_IMAGES[feat.localImageRef]) || solCharge
    }));
  } else if (fleetsData.length > 0) {
    showTabs = true;
    const activeFleet = fleetsData.find((f: any) => f.id === activeTab) || fleetsData[0];
    featuresToDisplay = activeFleet.features.map((feat: any) => ({
      ...feat,
      image: feat.imageUrl || (feat.localImageRef && LOCAL_IMAGES[feat.localImageRef]) || solCharge
    }));
  }

  const headingText = setupData?.setupHeading || "Recommended for your setup";

  const isForm = !!setupData?.setupForm;

  return (
    <section className={`bg-white px-6 md:px-12 lg:px-24 ${isForm ? "py-12 md:py-16" : "py-16 md:py-32"}`}>
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header & Tabs */}
        <ScrollReveal className={isForm ? "mb-6 md:mb-8 text-center" : "mb-16 md:mb-24"}>
          {headingText && (
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold text-[#1f2937] mb-8 tracking-tight font-[family-name:var(--font-primary)]">
              {headingText}
            </h2>
          )}

          {showTabs && (
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[12px] font-bold uppercase tracking-widest font-[family-name:var(--font-secondary)]">
              {fleetsData.map((fleet) => (
                <button
                  key={fleet.id}
                  onClick={() => setActiveTab(fleet.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${activeTab === fleet.id
                    ? "bg-[#00D384] text-black shadow-md"
                    : "text-black hover:bg-gray-100"
                    }`}
                >
                  {fleet.label}
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        {setupData?.setupForm ? (
          <ScrollReveal className="flex flex-col items-center relative w-full mt-4 md:mt-8">
            {setupData.setupForm.subtitle && (
              <p className="text-gray-500 mb-8 md:mb-10 text-center max-w-2xl">{setupData.setupForm.subtitle}</p>
            )}

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[800px] p-10 md:p-14 border border-gray-100">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <input type="text" name="bot-field" id="setup-form-bot" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="appDomain"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{setupData.setupForm.labels?.appDomain || "Application domain"}</label>
                          <FormControl>
                            <input type="text" placeholder={setupData.setupForm.placeholders?.appDomain || "e.g. BESS, Drone, Railway, OEM Onboard Charger, Grid Edge, Other"} className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 font-medium text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="powerRating"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{setupData.setupForm.labels?.powerRating || "Power rating range (kW)"}</label>
                          <FormControl>
                            <input type="text" placeholder={setupData.setupForm.placeholders?.powerRating || "e.g. 10–500 kW, or 'to be defined'"} className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 font-medium text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{setupData.setupForm.labels?.constraints || "Key constraints"}</label>
                        <FormControl>
                          <textarea rows={3} placeholder={setupData.setupForm.placeholders?.constraints || "Size / weight / operating environment / certifications required"} className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all resize-none" {...field}></textarea>
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="orgContact"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{setupData.setupForm.labels?.orgContact || "Email Address"}</label>
                          <FormControl>
                            <input type="email" placeholder={setupData.setupForm.placeholders?.orgContact || "name@company.com"} className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500 font-medium text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-black/50 font-bold">{setupData.setupForm.labels?.timeline || "Timeline"}</label>
                          <FormControl>
                            <input 
                              {...field} 
                              type="text" 
                              placeholder={setupData.setupForm.placeholders?.timeline || "Prototype required by / production volumes expected"} 
                              className="w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-5 py-4 text-[13px] outline-none focus:ring-1 focus:ring-[#00E573] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500 transition-all" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 font-medium text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {serverError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-4 text-xs font-semibold flex items-start gap-3 mt-4">
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
                      {isSubmitting ? "Sending..." : setupData.setupForm.labels?.submitBtn || "Talk to our expert"}
                      <span>→</span>
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal staggerChildren={true} className={`grid gap-10 md:gap-12 lg:gap-16 ${featuresToDisplay.length === 4
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-3"
            }`}>
            {featuresToDisplay.map((feature: any, idx: number) => (
              <div key={idx} className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col items-center">
                <div className="w-full aspect-[4/3] bg-gray-100 rounded-[2rem] overflow-hidden relative shadow-sm mb-8 transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl md:text-[1.75rem] font-bold text-[#1f2937] mb-4 text-center font-[family-name:var(--font-primary)]">
                  {feature.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed text-center max-w-[320px] font-[family-name:var(--font-secondary)]">
                  {feature.text}
                </p>
              </div>
            ))}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
