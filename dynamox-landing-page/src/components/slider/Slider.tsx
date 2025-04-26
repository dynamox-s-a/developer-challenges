import React, { useState, useRef } from "react";
import { dataSlider } from "./sliderData";
import styles from "./slider.module.css";

const Slider = () => {
  const [selected, setSelected] = useState(1);
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (startX.current !== null && endX.current !== null) {
      const distance = startX.current - endX.current;

      if (distance > 50 && selected < dataSlider.length - 1) {
        setSelected(selected + 1);
      } else if (distance < -50 && selected > 0) {
        setSelected(selected - 1);
      }
    }

    startX.current = null;
    endX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    endX.current = e.clientX;

    if (startX.current !== null && endX.current !== null) {
      const distance = startX.current - endX.current;

      if (distance > 50 && selected < dataSlider.length - 1) {
        setSelected(selected + 1);
      } else if (distance < -50 && selected > 0) {
        setSelected(selected - 1);
      }
    }

    startX.current = null;
    endX.current = null;
  };

  return (
    <div
      className={styles.sliderContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {dataSlider.map((item, index) => {
        const isSelected = index === selected;
        const itemClass = isSelected
          ? styles.selectedImageWrapper
          : styles.thumbnailWrapper;

        return (
          <div
            key={item.id}
            className={itemClass}
            onClick={() => setSelected(index)}
          >
            <img
              src={item.image}
              alt={`Slide ${index + 1}`}
              className={
                isSelected ? styles.selectedImage : styles.thumbnailImage
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
