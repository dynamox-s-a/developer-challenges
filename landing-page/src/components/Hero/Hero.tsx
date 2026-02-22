import { useEffect, useState } from 'react';
import styles from './Hero.module.scss';
import { heroData } from './Hero.data';

export function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % heroData.titleHighlights.length);
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
            key={heroData.titleHighlights[activeIndex]}
            className={styles.hero__titleHighlight}
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