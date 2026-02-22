import type { CarouselItem } from "./Carousel.types";
import engineeringTeam from '../../assets/images/engineering-team.webp';
import engineersReadingProject from '../../assets/images/engineers-reading-project.webp';
import technicianAnsweringPhone from '../../assets/images/technician-answering-phone.webp';

export const carouselItems: CarouselItem[] = [
  {
    src: technicianAnsweringPhone,
    alt: 'Industrial worker wearing a hard hat and safety glasses talking on a phone inside a factory',
  },
  {
    src: engineersReadingProject,
    alt: 'Two industrial engineers wearing hard hats reviewing data on a tablet at a construction and processing plant sit',
  },
    {
    src: engineeringTeam,
    alt: 'Group of industrial workers and a manager standing together inside a factory, wearing hard hats and holding a tablet and laptop',
  }
];