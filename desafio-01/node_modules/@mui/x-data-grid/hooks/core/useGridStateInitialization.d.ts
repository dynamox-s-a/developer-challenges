import * as React from 'react';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiCommon } from '../../models/api/gridApiCommon';
export declare const useGridStateInitialization: <Api extends GridApiCommon>(apiRef: React.MutableRefObject<Api>, props: Pick<DataGridProcessedProps, 'signature'>) => void;
