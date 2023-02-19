import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare const defaultPageSize: (autoPageSize: boolean) => 0 | 100;
/**
 * @requires useGridDimensions (event) - can be after
 */
export declare const useGridPageSize: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'pageSize' | 'onPageSizeChange' | 'autoPageSize' | 'initialState'>) => void;
