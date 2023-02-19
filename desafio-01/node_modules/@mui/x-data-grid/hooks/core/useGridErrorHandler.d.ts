import * as React from 'react';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
export declare function useGridErrorHandler(apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'error'>): void;
