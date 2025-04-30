export interface CarouselSlide {
  index: number;
  image: string;
  x: number;
  width: number;
  height: number;
  opacity: number;
  zIndex: number;
}

export interface DragInfo {
  offset: { x: number };
  point: { x: number };
}

export interface CarouselDimensions {
  width: number;
  height: number;
}

export interface CarouselConfig {
  desktop: {
    mainSlide: CarouselDimensions;
    sideSlide: CarouselDimensions;
    offset: number;
  };
  tablet: CarouselDimensions;
  mobile: CarouselDimensions;
}
