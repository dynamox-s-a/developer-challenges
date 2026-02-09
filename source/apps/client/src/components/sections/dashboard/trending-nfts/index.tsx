import { useState, useRef } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import { SwiperSlide } from 'swiper/react';
import { NFTData } from 'data/NFTData';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ReactSwiper from 'components/base/ReactSwiper';
import IconifyIcon from 'components/base/IconifyIcon';
import useResizeObserver from 'hooks/useResizeObserver';
import NFTCard from './NFTCard';

const TrendingNFTs = () => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerSize = useResizeObserver(containerRef);
  const [isSlideBegin, setIsSlideBegin] = useState(true);
  const [isSlideEnd, setIsSlideEnd] = useState(false);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <Stack
      component={Paper}
      height={350}
      ref={containerRef}
      direction="column"
      spacing={1.75}
      width={1}
      p={2}
    >
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Trending NFTs</Typography>
        <Stack mr={-1} spacing={1} alignItems="center" justifyContent="center">
          <IconButton
            onClick={handlePrev}
            size="large"
            sx={{
              p: 1,
              border: 'none',
              bgcolor: 'transparent !important',
              pointerEvents: isSlideBegin ? 'none' : 'auto',
            }}
          >
            <IconifyIcon
              icon="ic:round-arrow-back-ios"
              color={isSlideBegin ? 'text.secondary' : 'text.primary'}
              fontSize="h4.fontSize"
            />
          </IconButton>
          <IconButton
            onClick={handleNext}
            size="large"
            sx={{
              p: 1,
              border: 'none',
              bgcolor: 'transparent !important',
              pointerEvents: isSlideEnd ? 'none' : 'auto',
            }}
          >
            <IconifyIcon
              icon="ic:round-arrow-forward-ios"
              color={isSlideEnd ? 'text.secondary' : 'text.primary'}
              fontSize="h4.fontSize"
            />
          </IconButton>
        </Stack>
      </Stack>

      <ReactSwiper
        slidesPerView={
          containerSize > 1440 ? 4 : containerSize > 1024 ? 3 : containerSize > 600 ? 2 : 1
        }
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
          setIsSlideBegin(swiper.isBeginning);
          setIsSlideEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsSlideBegin(swiper.isBeginning);
          setIsSlideEnd(swiper.isEnd);
        }}
        sx={{ '& .swiper-slide': { width: 300 } }}
      >
        {NFTData.map((item) => (
          <SwiperSlide key={item.id}>
            <NFTCard data={item} />
          </SwiperSlide>
        ))}
      </ReactSwiper>
    </Stack>
  );
};

export default TrendingNFTs;
