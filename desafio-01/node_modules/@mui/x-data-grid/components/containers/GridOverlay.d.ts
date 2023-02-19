import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
export declare type GridOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
    sx?: SxProps<Theme>;
};
declare const GridOverlay: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & {
    sx?: SxProps<Theme> | undefined;
} & React.RefAttributes<HTMLDivElement>>;
export { GridOverlay };
