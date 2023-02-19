import * as React from 'react';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
export declare const useGridInitialization: <Api extends GridApiCommon>(inputApiRef: React.MutableRefObject<Api> | undefined, props: Pick<DataGridProcessedProps, 'signature' | 'logger' | 'logLevel' | 'error' | 'localeText'>) => React.MutableRefObject<Api>;
