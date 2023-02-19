import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { GridCsvExportOptions, GridPrintExportOptions } from '../../models/gridExport';
export interface GridExportDisplayOptions {
    /**
     * If `true`, this export option will be removed from the GridToolbarExport menu.
     * @default false
     */
    disableToolbarButton?: boolean;
}
export interface GridExportMenuItemProps<Options extends {}> {
    hideMenu?: () => void;
    options?: Options & GridExportDisplayOptions;
}
export declare type GridCsvExportMenuItemProps = GridExportMenuItemProps<GridCsvExportOptions>;
export declare type GridPrintExportMenuItemProps = GridExportMenuItemProps<GridPrintExportOptions>;
export interface GridToolbarExportProps extends ButtonProps {
    csvOptions?: GridCsvExportOptions & GridExportDisplayOptions;
    printOptions?: GridPrintExportOptions & GridExportDisplayOptions;
    [key: string]: any;
}
export declare const GridCsvExportMenuItem: (props: GridCsvExportMenuItemProps) => JSX.Element;
export declare const GridPrintExportMenuItem: (props: GridPrintExportMenuItemProps) => JSX.Element;
declare const GridToolbarExport: React.ForwardRefExoticComponent<Pick<GridToolbarExportProps, keyof GridToolbarExportProps> & React.RefAttributes<HTMLButtonElement>>;
export { GridToolbarExport };
