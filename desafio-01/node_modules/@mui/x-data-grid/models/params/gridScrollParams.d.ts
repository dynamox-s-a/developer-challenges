export interface GridRenderContext {
    firstRowIndex: number;
    lastRowIndex: number;
    firstColumnIndex: number;
    lastColumnIndex: number;
}
export interface GridScrollParams {
    left: number;
    top: number;
    renderContext?: GridRenderContext;
}
export declare type GridScrollFn = (v: GridScrollParams) => void;
