import { useEffect, useState } from "react";
import styles from "./title.module.css";

const texts = [
  "mais produtiva",
  "mais segura",
  "mais confiável",
  "mais inovadora",
  "mais colaborativa",
];

export function Title() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>
        Juntos por uma indústria
        <br />
        <span
          className={`${styles.subTitle} ${
            fade ? styles.fadeIn : styles.fadeOut
          }`}
        >
          {texts[index]}
        </span>
      </h1>
    </div>
  );
}
