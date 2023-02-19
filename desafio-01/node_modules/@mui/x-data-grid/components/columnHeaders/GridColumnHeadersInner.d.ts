import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
interface GridColumnHeadersInnerProps extends React.HTMLAttributes<HTMLDivElement> {
    isDragging: boolean;
    sx?: SxProps<Theme>;
}
export declare const GridColumnHeadersInner: React.ForwardRefExoticComponent<GridColumnHeadersInnerProps & React.RefAttributes<HTMLDivElement>>;
export {};
