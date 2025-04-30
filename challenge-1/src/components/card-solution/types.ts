import { ReactNode } from 'react';

export interface CardSolutionProps {
  mainImage: string;
  iconImage: string;
  title: ReactNode;
  description?: ReactNode;
  imagePosition?: 'left' | 'right';
  items?: string[];
}
