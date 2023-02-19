import * as React from 'react';
import { GridCellMode, GridRowId } from '../../models';
import { GridAlignment } from '../../models/colDef/gridColDef';
export interface GridCellProps<V = any, F = V> {
    align: GridAlignment;
    className?: string;
    colIndex: number;
    field: string;
    rowId: GridRowId;
    formattedValue?: F;
    hasFocus?: boolean;
    height: number | 'auto';
    isEditable?: boolean;
    showRightBorder?: boolean;
    value?: V;
    width: number;
    cellMode?: GridCellMode;
    children: React.ReactNode;
    tabIndex: 0 | -1;
    colSpan?: number;
    disableDragEvents?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onDragEnter?: React.DragEventHandler<HTMLDivElement>;
    onDragOver?: React.DragEventHandler<HTMLDivElement>;
    [x: string]: any;
}
declare function GridCell(props: GridCellProps): JSX.Element;
declare namespace GridCell {
    var propTypes: any;
}
export { GridCell };
