import type { ReactNode } from 'react';
import Icon from '../atoms/Icon/Icon';
import styles from './ContentImageSection.module.scss';
import type { ContentImageSectionProps } from './ContentImageSection.types';

function parseBold(text: string): ReactNode[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const parts = text.split(regex);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={`bold-${index}`}>{part}</strong>
    ) : (
      part
    )
  );
}

export function ContentImageSection({
  imageSrc,
  imageAlt,
  icon: IconSvg,
  titleHighlight,
  title,
  items,
  textContent,
  linkLabel,
  linkUrl,
  reverse,
}: ContentImageSectionProps) {
  return (
    <section className={`${styles['content-image-section']} ${reverse ? styles['content-image-section--reverse'] : ''}`}>
        <div className={styles['content-image-section__image-wrapper']}>
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              className={styles['content-image-section__image']}
            />
        </div>
        <div className={styles['content-image-section__content']}>
           {IconSvg && (
            <div className={styles['content-image-section__icon-wrapper']}>
                <Icon
                icon={IconSvg}
                size={32}
                ariaLabel="Feature icon"
                className={styles['content-image-section__icon']}
                />
            </div>
            )}
            <h3 className={styles['content-image-section__title-highlight']}>
                {titleHighlight}{' '}
                <span className={styles['content-image-section__title']}>
                    {title}
                </span>
            </h3>
            <ul className={styles['content-image-section__list']}>
                {items?.map((item, index) => (
                <li key={index} className={styles['content-image-section__list-item']}>{item.text}</li>
                ))}
            </ul>
            {textContent && <p>{parseBold(textContent)}</p>}
            <hr className={styles['content-image-section__divider']} />
            <a className={styles['content-image-section__link']} href={linkUrl} target='_blank' rel='noopener noreferrer'>{linkLabel}</a>
            
        </div>
    </section>
  );
};

export default ContentImageSection;