import * as React from 'react';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const selectionStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'selectionModel'>>;
/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */
export declare const useGridSelection: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'checkboxSelection' | 'selectionModel' | 'onSelectionModelChange' | 'disableMultipleSelection' | 'disableSelectionOnClick' | 'isRowSelectable' | 'checkboxSelectionVisibleOnly' | 'pagination' | 'paginationMode' | 'classes' | 'keepNonExistentRowsSelected'>) => void;
