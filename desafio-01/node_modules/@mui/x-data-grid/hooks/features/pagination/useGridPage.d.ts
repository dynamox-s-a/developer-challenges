import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare const getPageCount: (rowCount: number, pageSize: number) => number;
/**
 * @requires useGridPageSize (event)
 */
export declare const useGridPage: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'page' | 'onPageChange' | 'rowCount' | 'initialState' | 'paginationMode'>) => void;
