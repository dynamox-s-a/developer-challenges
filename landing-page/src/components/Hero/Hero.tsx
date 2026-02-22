import { useEffect, useState } from 'react';
import styles from './Hero.module.scss';
import { heroData } from './Hero.data';

export function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setAnimate(false);
        setTimeout(() => {
          setActiveIndex((prev) =>
            (prev + 1) % heroData.titleHighlights.length
          );
          setAnimate(true);
        }, 100);
      }, 2400);

      return () => clearInterval(interval);
    }, []);

  return (
    <section className={styles.hero}>
        <img src={heroData.brand.logoSrc} alt={heroData.brand.logoAlt} className={styles.hero__image} />
      <div className={styles.hero__content}>
              <h1 className={styles.hero__title}>
        {heroData.title}{' '}
        <span
          className={`${styles.hero__titleHighlight} ${
            animate ? styles.animate : ''}`}
        >
          {heroData.titleHighlights[activeIndex]}
        </span>
      </h1>
        <p className={styles.hero__description}>
            {heroData.description}
        </p>
      </div>
    </section>
  )
}