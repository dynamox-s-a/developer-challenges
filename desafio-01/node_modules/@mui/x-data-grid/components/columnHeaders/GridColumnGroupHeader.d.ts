/// <reference types="react" />
interface GridColumnGroupHeaderProps {
    groupId: string | null;
    width: number;
    fields: string[];
    colIndex: number;
    isLastColumn: boolean;
    extendRowFullWidth: boolean;
    depth: number;
    maxDepth: number;
    height: number;
}
declare function GridColumnGroupHeader(props: GridColumnGroupHeaderProps): JSX.Element;
export { GridColumnGroupHeader };
