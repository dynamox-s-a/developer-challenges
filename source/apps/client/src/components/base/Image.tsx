import { Box, SxProps } from '@mui/material';
import { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  sx?: SxProps;
}
const Image = ({ sx, ...rest }: ImageProps) => {
  return <Box component="img" sx={sx} {...rest} />;
};

export default Image;
