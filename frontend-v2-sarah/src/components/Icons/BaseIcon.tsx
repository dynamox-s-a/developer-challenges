import type { SVGProps } from 'react';

export interface BaseIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

export const BaseIcon = ({
  size = 24,
  viewBoxWidth,
  viewBoxHeight,
  children,
  ...props
}: BaseIconProps) => {
  const aspectRatio = viewBoxHeight / viewBoxWidth;
  const width = size;
  const height = Math.round(size * aspectRatio);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
};
