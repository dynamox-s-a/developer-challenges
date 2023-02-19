import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridColumnGroupingModel, GridColumnGroup } from '../../../models/gridColumnGrouping';
import { GridStateColDef, GridColDef } from '../../../models/colDef';
export declare function hasGroupPath(lookupElement: GridColDef | GridStateColDef): lookupElement is GridStateColDef;
declare type UnwrappedGroupingModel = {
    [key: GridColDef['field']]: GridColumnGroup['groupId'][];
};
/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */
export declare const unwrapGroupingColumnModel: (columnGroupingModel?: GridColumnGroupingModel) => UnwrappedGroupingModel;
export declare const columnGroupsStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'columnGroupingModel'>>;
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export declare const useGridColumnGrouping: (apiRef: React.MutableRefObject<GridApiCommunity>, props: Pick<DataGridProcessedProps, 'columnGroupingModel' | 'experimentalFeatures'>) => void;
export {};
