import styles from './ContentSection.module.scss';
import type { ContentSectionProps } from './ContentSection.types';

export function ContentSection({
  title,
  titleHighlight,
  textContent
}: ContentSectionProps) {
  return (
    <section className={styles['content-section']}>
        <h2 className={styles['content-section__title']}>
                {title}
                <span className={styles['content-section__title-highlight']}>
                    {titleHighlight}{' '}
                </span>
        </h2>
        <div className={styles['content-section__text-wrapper']}>
            {textContent.map((paragraph, index) => (
                <p key={index} className={styles['content-section__text']}>{paragraph}</p>
            ))}
        </div>
    </section>
  );
};

export default ContentSection;