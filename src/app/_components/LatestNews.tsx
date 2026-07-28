"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './LatestNews.module.css';


export default function LatestNews({ data, locale }: { data: any, locale: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  
  const news = data.posts || [];

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
    <section className={styles.newsSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{data.heading}</h2>
          <a href={`/${locale}/insights`} className={styles.viewAll}>{data.viewAll}</a>
        </div>
        <div className={styles.newsGrid}>
          {news.map((item: any, index: number) => {
            const date = new Date(item.publishedAt).toLocaleDateString(
              locale === 'es-419' ? 'es-MX' : 'en-US', 
              { year: 'numeric', month: 'long', day: 'numeric' }
            );
            return (
              <div key={index} className={styles.newsCard}>
                <div className={styles.imageWrapper}>
                  <Image src={item.imageUrl} alt={item.title} fill className={styles.image} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  <div className={styles.meta}>
                    <span className={styles.date}>{date}</span>
                    <a href={`/${locale}/insights?post=${item.slug}`} className={styles.readMore}>{data.readMore}</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
