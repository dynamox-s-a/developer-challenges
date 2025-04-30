import imageCarrousel1 from '@/assets/image-carrousel1.png';
import imageCarrousel2 from '@/assets/image-carrousel2.png';
import imageCarrousel3 from '@/assets/image-carrousel3.png';
import { CarouselSlide } from './carousel-slide';
import { useCarousel } from './useCarousel';

const images = [imageCarrousel1, imageCarrousel2, imageCarrousel3];

export function Carousel() {
  const { currentIndex, isDesktop, handleDragStart, handleDragEnd, slides, totalSlides } =
    useCarousel({ images });

  return (
    <div className="w-full h-[540px] lg:overflow-visible overflow-hidden lg:pt-36">
      <div className="relative w-full h-full">
        {slides.map((slide) => (
          <CarouselSlide
            key={slide.index}
            {...slide}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDesktop={isDesktop}
          />
        ))}

        {!isDesktop && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
