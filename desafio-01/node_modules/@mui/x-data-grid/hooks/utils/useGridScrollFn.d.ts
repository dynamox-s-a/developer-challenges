import * as React from 'react';
import { GridScrollFn } from '../../models/params/gridScrollParams';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';
export declare function useGridScrollFn(apiRef: React.MutableRefObject<GridApiCommunity>, renderingZoneElementRef: React.RefObject<HTMLDivElement>, columnHeadersElementRef: React.RefObject<HTMLDivElement>): [GridScrollFn];
