"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { sendEmail } from "@/actions/sendEmail";
import styles from './Contact.module.css';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function Contact({ data }: { data: any }) {
  const sectionRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });
    
    const botField = document.querySelector<HTMLInputElement>('#contact-form-bot');
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
            <p className={styles.description}>
              {data.description}
            </p>
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
                          <input type="text" placeholder={data.namePlaceholder} className={styles.input} {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <input type="email" placeholder={data.emailPlaceholder} className={styles.input} {...field} />
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
                        <textarea placeholder={data.messagePlaceholder} className={styles.textarea} rows={4} {...field}></textarea>
                      </FormControl>
                      <FormMessage className="text-red-500 font-medium text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <button type="submit" disabled={isSubmitting} className={`${styles.submitBtn} disabled:opacity-70 disabled:cursor-not-allowed`}>
                  {isSubmitting ? "Sending..." : data.submitBtn}
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
