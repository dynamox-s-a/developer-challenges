'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
  type: 'dynamox' | 'dynapredict';
}

export function Logo({ height = HEIGHT, width = WIDTH, type = 'dynapredict' }: LogoProps): React.JSX.Element {
  const url = type === 'dynapredict' ? '/new_assets/logo-dynapredict.png' : '/new_assets/logo-dynamox.png';
  const alt = type === 'dynapredict' ? 'Dynapredict' : 'Dynamox';

  return <Box alt={alt} component="img" height={height} src={url} width={width} sx={{ objectFit: 'contain' }} />;
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}
