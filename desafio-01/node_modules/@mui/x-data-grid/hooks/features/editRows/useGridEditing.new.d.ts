import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const editingStateInitializer: GridStateInitializer;
export declare const useGridEditing: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'isCellEditable' | 'editMode' | 'processRowUpdate' | 'disableIgnoreModificationsIfProcessingProps'>) => void;
