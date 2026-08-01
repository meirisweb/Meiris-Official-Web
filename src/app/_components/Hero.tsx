"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from './Hero.module.css';

export default function Hero({ data }: { data: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentLocale = useLocale();

  const scrollToSolutions = () => {
    const solutionsSection = document.getElementById("solutions");
    if (solutionsSection) {
      solutionsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background video */}
      <div className={styles.background}>
        <video
          ref={videoRef}
          className={styles.videoBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          poster="/images/Depot.png"
          aria-hidden="true"
        >
          <source src={data.videoUrl} type="video/mp4" />
        </video>
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          {data.title1} <br className={styles.desktopBr} />
          {data.title2} <span className={styles.highlight}>{data.title3}</span> <br className={styles.desktopBr} />
          <span className={styles.highlight}>{data.title4}</span> {data.title5}
        </h1>
      </div>

      <div className={styles.bottomContent}>
        <p className={styles.description}>
          {data.description}
        </p>
        <div className={styles.actions}>
          <Link href={`/${currentLocale}/platform`} className={`${styles.btn} ${styles.btnPrimary}`}>
            {data.btnExplore || "Explore architecture"}
          </Link>
          <button
            type="button"
            onClick={scrollToSolutions}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            {data.btnSolutions || "View solutions"}
          </button>
        </div>
      </div>
    </section>
  );
}
