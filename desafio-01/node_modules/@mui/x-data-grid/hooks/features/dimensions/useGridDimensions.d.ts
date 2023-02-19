import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
export declare function useGridDimensions(apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'onResize' | 'scrollbarSize' | 'pagination' | 'paginationMode' | 'autoHeight' | 'getRowHeight'>): void;
