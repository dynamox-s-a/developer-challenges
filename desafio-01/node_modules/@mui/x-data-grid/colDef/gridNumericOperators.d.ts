import { GridFilterOperator } from '../models/gridFilterOperator';
import { GridCellParams } from '../models';
export declare const getGridNumericQuickFilterFn: (value: any) => (({ value }: GridCellParams) => boolean) | null;
export declare const getGridNumericOperators: () => GridFilterOperator<any, number | string | null, any>[];
/**
 * @deprecated Use `getGridNumericOperators` instead.
 */
export declare const getGridNumericColumnOperators: (() => GridFilterOperator<any, number | string | null, any>[]) | ((...args: any[]) => any);
