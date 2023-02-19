/// <reference types="react" />
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { GridMenuProps } from '../menu/GridMenu';
interface GridActionsCellProps extends Omit<GridRenderCellParams, 'value' | 'formattedValue'> {
    value?: GridRenderCellParams['value'];
    formattedValue?: GridRenderCellParams['formattedValue'];
    position?: GridMenuProps['position'];
}
declare const GridActionsCell: {
    (props: GridActionsCellProps): JSX.Element;
    propTypes: any;
};
export { GridActionsCell };
export declare const renderActionsCell: (params: GridRenderCellParams) => JSX.Element;
