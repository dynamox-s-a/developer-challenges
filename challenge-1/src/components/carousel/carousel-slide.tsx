import { motion } from 'framer-motion';
import { CarouselSlide as CarouselSlideType, DragInfo } from './types';

interface CarouselSlideProps extends CarouselSlideType {
  onDragStart: () => void;
  onDragEnd: (e: unknown, info: DragInfo) => void;
  isDesktop: boolean;
}

export function CarouselSlide({
  index,
  image,
  x,
  width,
  height,
  opacity,
  zIndex,
  onDragStart,
  onDragEnd,
  isDesktop,
}: CarouselSlideProps) {
  return (
    <motion.div
      key={index}
      className="absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing"
      style={{
        width,
        height,
        marginLeft: -(width / 2),
        marginTop: -(height / 2),
        zIndex,
      }}
      animate={{
        x,
        opacity,
        scale: isDesktop ? (opacity === 1 ? 1 : 0.9) : 1,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
    >
      <img
        src={image}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover rounded-lg shadow-lg"
        draggable="false"
        loading="lazy"
        fetchPriority="high"
      />
    </motion.div>
  );
}
