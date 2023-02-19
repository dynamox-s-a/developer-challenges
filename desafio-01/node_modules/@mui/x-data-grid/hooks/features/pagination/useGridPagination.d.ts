import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const paginationStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'page' | 'pageSize' | 'rowCount' | 'initialState' | 'autoPageSize'>>;
/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export declare const useGridPagination: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'page' | 'pageSize' | 'onPageChange' | 'onPageSizeChange' | 'autoPageSize' | 'rowCount' | 'initialState' | 'paginationMode'>) => void;
