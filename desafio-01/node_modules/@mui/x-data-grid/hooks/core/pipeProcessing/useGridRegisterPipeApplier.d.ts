import * as React from 'react';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
export declare const useGridRegisterPipeApplier: <Api extends GridApiCommon, G extends keyof import("./gridPipeProcessingApi").GridPipeProcessingLookup>(apiRef: React.MutableRefObject<Api>, group: G, callback: () => void) => void;
