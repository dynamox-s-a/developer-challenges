export declare type GridColumnIndex = number;
export declare type GridCellColSpanInfo = {
    spannedByColSpan: true;
    rightVisibleCellIndex: GridColumnIndex;
    leftVisibleCellIndex: GridColumnIndex;
} | {
    spannedByColSpan: false;
    cellProps: {
        colSpan: number;
        width: number;
    };
};
