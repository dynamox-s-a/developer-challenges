import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
export declare const columnMenuStateInitializer: GridStateInitializer;
/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export declare const useGridColumnMenu: (apiRef: React.MutableRefObject<GridApiCommunity>) => void;
