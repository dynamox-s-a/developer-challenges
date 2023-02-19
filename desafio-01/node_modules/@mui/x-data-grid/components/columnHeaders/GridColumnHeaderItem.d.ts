/// <reference types="react" />
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { GridSortDirection } from '../../models/gridSortModel';
import { GridColumnHeaderSeparatorProps } from './GridColumnHeaderSeparator';
interface GridColumnHeaderItemProps {
    colIndex: number;
    column: GridStateColDef;
    columnMenuOpen: boolean;
    headerHeight: number;
    isDragging: boolean;
    isResizing: boolean;
    isLastColumn: boolean;
    extendRowFullWidth: boolean;
    sortDirection: GridSortDirection;
    sortIndex?: number;
    filterItemsCounter?: number;
    hasFocus?: boolean;
    tabIndex: 0 | -1;
    disableReorder?: boolean;
    separatorSide?: GridColumnHeaderSeparatorProps['side'];
}
declare function GridColumnHeaderItem(props: GridColumnHeaderItemProps): JSX.Element;
declare namespace GridColumnHeaderItem {
    var propTypes: any;
}
export { GridColumnHeaderItem };
