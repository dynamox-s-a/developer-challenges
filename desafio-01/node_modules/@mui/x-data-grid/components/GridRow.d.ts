import * as React from 'react';
import { GridRowId, GridRowModel } from '../models/gridRows';
import { GridEditRowsModel } from '../models/gridEditRowModel';
import { GridStateColDef } from '../models/colDef/gridColDef';
import { GridCellIdentifier } from '../hooks/features/focus/gridFocusState';
export interface GridRowProps {
    rowId: GridRowId;
    selected: boolean;
    /**
     * Index of the row in the whole sorted and filtered dataset.
     * If some rows above have expanded children, this index also take those children into account.
     */
    index: number;
    rowHeight: number | 'auto';
    containerWidth: number;
    firstColumnToRender: number;
    lastColumnToRender: number;
    visibleColumns: GridStateColDef[];
    renderedColumns: GridStateColDef[];
    cellFocus: GridCellIdentifier | null;
    cellTabIndex: GridCellIdentifier | null;
    editRowsState: GridEditRowsModel;
    position: 'left' | 'center' | 'right';
    row?: GridRowModel;
    isLastVisible?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}
declare const GridRow: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & GridRowProps & React.RefAttributes<HTMLDivElement>>;
export { GridRow };
