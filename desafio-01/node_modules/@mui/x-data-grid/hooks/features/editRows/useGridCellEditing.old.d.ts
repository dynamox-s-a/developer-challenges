import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare const useCellEditing: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'editMode' | 'onCellEditCommit' | 'onCellEditStart' | 'onCellEditStop' | 'experimentalFeatures'>) => void;
