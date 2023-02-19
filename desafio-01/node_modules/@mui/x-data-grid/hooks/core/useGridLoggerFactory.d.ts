import * as React from 'react';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
export declare const useGridLoggerFactory: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'logger' | 'logLevel'>) => void;
