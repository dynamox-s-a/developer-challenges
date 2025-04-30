import { useState, useEffect, useCallback } from 'react';
import { CarouselSlide, DragInfo, CarouselConfig } from './types';

const defaultConfig: CarouselConfig = {
  desktop: {
    mainSlide: { width: 954, height: 540 },
    sideSlide: { width: 588, height: 331 },
    offset: 360,
  },
  tablet: { width: 700, height: 400 },
  mobile: { width: 320, height: 180 },
};

interface UseCarouselProps {
  images: string[];
  config?: CarouselConfig;
  autoPlayInterval?: number;
}

export function useCarousel({
  images,
  config = defaultConfig,
  autoPlayInterval = 5000,
}: UseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleDragStart = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: DragInfo) => {
      const dragDistance = info.offset.x;
      const dragThreshold = 50;

      if (dragDistance > dragThreshold) {
        handlePrevSlide();
      } else if (dragDistance < -dragThreshold) {
        handleNextSlide();
      }

      setTimeout(() => setIsPaused(false), 5000);
    },
    [handlePrevSlide, handleNextSlide]
  );

  const calculateSlides = useCallback((): CarouselSlide[] => {
    if (!isDesktop) {
      const dimensions = window.innerWidth >= 768 ? config.tablet : config.mobile;
      return [
        {
          index: currentIndex,
          image: images[currentIndex],
          x: 0,
          width: dimensions.width,
          height: dimensions.height,
          opacity: 1,
          zIndex: 1,
        },
      ];
    }

    return images
      .map((image, index) => {
        const position = (index - currentIndex + images.length) % images.length;
        const normalizedPosition = position > 1 ? position - images.length : position;
        const isCurrent = normalizedPosition === 0;

        return {
          index,
          image,
          x: normalizedPosition * config.desktop.offset,
          width: isCurrent ? config.desktop.mainSlide.width : config.desktop.sideSlide.width,
          height: isCurrent ? config.desktop.mainSlide.height : config.desktop.sideSlide.height,
          opacity: isCurrent ? 1 : 0.6,
          zIndex: isCurrent ? 2 : 1,
        };
      })
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [currentIndex, isDesktop, images, config]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(handleNextSlide, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoPlayInterval, handleNextSlide]);

  return {
    currentIndex,
    isDesktop,
    handleDragStart,
    handleDragEnd,
    handlePrevSlide,
    handleNextSlide,
    slides: calculateSlides(),
    totalSlides: images.length,
  };
}
