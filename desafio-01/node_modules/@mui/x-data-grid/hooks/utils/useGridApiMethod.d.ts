import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
export declare function useGridApiMethod<Api extends GridApiCommon, T extends Partial<Api>>(apiRef: React.MutableRefObject<Api>, apiMethods: T, apiName: string): void;
