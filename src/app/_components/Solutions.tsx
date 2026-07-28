"use client";
import { useEffect, useRef } from 'react';
import styles from './Solutions.module.css';
import Link from 'next/link';
export default function Solutions({ data }: { data: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  
  const solutions = data.solutions || [];

  useEffect(() => {
    const cardEls = sectionRef.current?.querySelectorAll(`.${styles.card}`) ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add(styles.sectionVisible);
            cardEls.forEach((card, i) => {
              setTimeout(() => card.classList.add(styles.cardVisible), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.solutions} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{data.heading}</h2>
        </div>

        <div className={styles.cardsGrid}>
          {solutions.map((sol: any, i: number) => (
            <Link
              key={i}
              href={sol.href}
              className={styles.card}
              style={{ backgroundImage: `url(${sol.imageUrl || '/images/CustomSolutions.png'})` }}
            >
              <div className={styles.cardOverlay} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{sol.title}</h3>
                <p className={styles.cardDesc}>{sol.description}</p>
                <span className={styles.cardCta}>{data.exploreText}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
