import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
/**
 * @deprecated Use `apiRef.current` instead.
 */
export declare const useGridApi: <Api extends GridApiCommon>(apiRef: React.MutableRefObject<Api>) => Api;
