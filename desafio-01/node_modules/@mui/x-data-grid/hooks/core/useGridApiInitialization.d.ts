import * as React from 'react';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiCommon } from '../../models';
export declare function useGridApiInitialization<Api extends GridApiCommon>(inputApiRef: React.MutableRefObject<Api> | undefined, props: Pick<DataGridProcessedProps, 'signature'>): React.MutableRefObject<Api>;
