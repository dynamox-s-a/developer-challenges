import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare const useGridRowEditing: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'editMode' | 'processRowUpdate' | 'onRowEditStart' | 'onRowEditStop' | 'onProcessRowUpdateError' | 'rowModesModel' | 'onRowModesModelChange' | 'signature' | 'disableIgnoreModificationsIfProcessingProps'>) => void;
