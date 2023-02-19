import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridCellParams, GridColDef } from '../models';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
export declare const getGridSingleSelectQuickFilterFn: (value: any, column: GridColDef, apiRef: React.MutableRefObject<GridApiCommunity>) => (({ value }: GridCellParams) => boolean) | null;
export declare const getGridSingleSelectOperators: () => GridFilterOperator[];
