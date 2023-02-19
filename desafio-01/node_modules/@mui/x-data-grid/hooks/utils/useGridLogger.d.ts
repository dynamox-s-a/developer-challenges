import * as React from 'react';
import { Logger } from '../../models/logger';
import { GridApiCommon } from '../../models/api/gridApiCommon';
export declare function useGridLogger<Api extends GridApiCommon>(apiRef: React.MutableRefObject<Api>, name: string): Logger;
