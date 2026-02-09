import { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Swiper, SwiperProps } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';

export interface ReactSwiperProps extends BoxProps {
  slidesPerView: number;
  children: React.ReactNode;
  onBeforeInit?: (swiper: SwiperClass) => void;
  onSlideChange?: (swiper: SwiperClass) => void;
}

const ReactSwiper = forwardRef<null | SwiperProps, ReactSwiperProps>(
  ({ children, slidesPerView, onBeforeInit, onSlideChange, ...rest }, ref) => {
    return (
      <Box
        component={Swiper}
        ref={ref}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={slidesPerView}
        onBeforeInit={onBeforeInit}
        onSlideChange={onSlideChange}
        width={1}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

export default ReactSwiper;
