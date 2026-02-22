import { useState } from "react";
import styles from "./Carousel.module.scss";
import type { ImageCarouselProps } from "./Carousel.types";

export function ImageCarousel({ items, ariaLabel = "Image Carousel" }: ImageCarouselProps) {
    const [selected, setSelected] = useState(0);

    const prevIndex = (selected - 1 + items.length) % items.length;
    const nextIndex = (selected + 1) % items.length;

    return (
        <section className={styles["image-carousel"]} aria-label={ariaLabel}>
            <ul className={styles["image-carousel__list"]} role="list">
                {items.map((image, index) => {
                    let positionClass = styles["image-carousel__position--hidden"];
                    
                    if (index === selected) {
                        positionClass = styles["image-carousel__position--center"];
                    } else if (index === prevIndex) {
                        positionClass = styles["image-carousel__position--left"];
                    } else if (index === nextIndex) {
                        positionClass = styles["image-carousel__position--right"];
                    }

                    return (
                        <li 
                            key={image.src} 
                            className={`${styles["image-carousel__item"]} ${positionClass}`}
                        >
                            <button
                                type="button"
                                className={styles["image-carousel__button"]}
                                onClick={() => setSelected(index)}
                                aria-label={`View image ${index + 1}`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    loading="lazy"
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default ImageCarousel;