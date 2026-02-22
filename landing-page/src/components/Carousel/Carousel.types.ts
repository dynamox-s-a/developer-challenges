export type CarouselItem = {
    src: string;
    alt: string;
};

export type ImageCarouselProps = {
    items: CarouselItem[];
    ariaLabel?: string;
};