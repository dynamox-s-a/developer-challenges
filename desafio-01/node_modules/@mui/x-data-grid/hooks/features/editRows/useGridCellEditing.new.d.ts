import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare const useGridCellEditing: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'editMode' | 'processRowUpdate' | 'onCellEditStart' | 'onCellEditStop' | 'cellModesModel' | 'onCellModesModelChange' | 'onProcessRowUpdateError' | 'signature' | 'disableIgnoreModificationsIfProcessingProps'>) => void;
