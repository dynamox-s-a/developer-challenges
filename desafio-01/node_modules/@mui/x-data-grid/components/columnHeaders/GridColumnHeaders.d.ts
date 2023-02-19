import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
interface GridColumnHeadersProps extends React.HTMLAttributes<HTMLDivElement> {
    sx?: SxProps<Theme>;
}
export declare const GridColumnHeaders: React.ForwardRefExoticComponent<GridColumnHeadersProps & React.RefAttributes<HTMLDivElement>>;
export {};
