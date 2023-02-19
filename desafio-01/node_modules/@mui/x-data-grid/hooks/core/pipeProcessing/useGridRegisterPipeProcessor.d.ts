import * as React from 'react';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { GridPipeProcessor } from './gridPipeProcessingApi';
export declare const useGridRegisterPipeProcessor: <Api extends GridApiCommon, G extends keyof import("./gridPipeProcessingApi").GridPipeProcessingLookup>(apiRef: React.MutableRefObject<Api>, group: G, callback: GridPipeProcessor<G>) => void;
