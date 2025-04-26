import styles from "./card.module.css";
import { ButtonLink } from "../buttons/ButtonLink";

interface CardProps {
  image: string;
  icon: string;
  titleSpan: string;
  title: string;
  description?: string;
  list?: string[];
  linkText?: string;
  invert?: boolean;
}

export const Card = ({
  image,
  icon,
  titleSpan,
  title: title,
  description: description,
  list,
  linkText,
  invert = false,
}: CardProps) => {
  return (
    <div className={`${styles.card} ${invert ? styles.invert : ""}`}>
      <img src={image} alt="image" className={styles.image} />
      <div className={styles.content}>
        <img src={icon} alt="Ícone" className={styles.icon} />
        <h3 className={styles.title}>
          <span className={styles.titleSpan}>{titleSpan}</span>
          <br />
          {title}
        </h3>
        {description && (
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        {list && (
          <ul className={styles.list}>
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {linkText && (
          <ButtonLink variante="card" href="https://dynamox.net/blog">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2v20M2 12h20"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            {linkText}
          </ButtonLink>
        )}
      </div>
    </div>
  );
};
