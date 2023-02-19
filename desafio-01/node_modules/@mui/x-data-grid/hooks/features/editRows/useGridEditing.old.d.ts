import * as React from 'react';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const editingStateInitializer: GridStateInitializer;
/**
 * @requires useGridFocus - can be after, async only
 * @requires useGridParamsApi (method)
 * @requires useGridColumns (state)
 */
export declare function useGridEditing(apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'editRowsModel' | 'onEditRowsModelChange' | 'isCellEditable' | 'onEditCellPropsChange' | 'editMode' | 'onRowEditCommit' | 'onRowEditStart' | 'onRowEditStop' | 'onCellEditCommit' | 'onCellEditStart' | 'onCellEditStop' | 'experimentalFeatures'>): void;
