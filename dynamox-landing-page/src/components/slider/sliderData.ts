import img1 from "../../assets/images/img-carousel-1.png";
import img2 from "../../assets/images/img-carousel-2.png";
import img3 from "../../assets/images/img-carousel-3.png";

export interface SliderItem {
  id: number;
  image: string;
}

export const dataSlider: SliderItem[] = [
  { id: 1, image: img1 },
  { id: 2, image: img2 },
  { id: 3, image: img3 },
];
