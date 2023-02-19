import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { GridFilterFormProps } from './GridFilterForm';
export interface GridFilterPanelProps extends Pick<GridFilterFormProps, 'linkOperators' | 'columnsSort'> {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
    /**
     * Props passed to each filter form.
     */
    filterFormProps?: Pick<GridFilterFormProps, 'columnsSort' | 'deleteIconProps' | 'linkOperatorInputProps' | 'operatorInputProps' | 'columnInputProps' | 'valueInputProps'>;
    /**
     * @ignore - do not document.
     */
    children?: React.ReactNode;
}
declare const GridFilterPanel: React.ForwardRefExoticComponent<GridFilterPanelProps & React.RefAttributes<HTMLDivElement>>;
export { GridFilterPanel };
