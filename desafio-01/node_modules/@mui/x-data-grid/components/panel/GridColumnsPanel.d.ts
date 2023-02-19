/// <reference types="react" />
import { GridPanelWrapperProps } from './GridPanelWrapper';
import type { GridStateColDef } from '../../models/colDef/gridColDef';
export interface GridColumnsPanelProps extends GridPanelWrapperProps {
    sort?: 'asc' | 'desc';
    searchPredicate?: (column: GridStateColDef, searchValue: string) => boolean;
    autoFocusSearchField?: boolean;
}
declare function GridColumnsPanel(props: GridColumnsPanelProps): JSX.Element;
declare namespace GridColumnsPanel {
    var propTypes: any;
}
export { GridColumnsPanel };
