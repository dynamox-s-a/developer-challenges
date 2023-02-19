import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { isDeepEqual } from '../../../utils/utils';
import { unwrapGroupingColumnModel, hasGroupPath } from './useGridColumnGrouping';
export const useGridColumnGroupingPreProcessors = (apiRef, props) => {
  var _props$experimentalFe2;

  const addHeaderGroups = React.useCallback(columnsState => {
    var _props$experimentalFe;

    if (!((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.columnGrouping)) {
      return columnsState;
    }

    const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel);
    columnsState.all.forEach(field => {
      var _unwrappedGroupingMod, _unwrappedGroupingMod2;

      const newGroupPath = (_unwrappedGroupingMod = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod : [];
      const lookupElement = columnsState.lookup[field];

      if (hasGroupPath(lookupElement) && isDeepEqual(newGroupPath, lookupElement == null ? void 0 : lookupElement.groupPath)) {
        // Avoid modifying the pointer to allow shadow comparison in https://github.com/mui/mui-x/blob/f90afbf10a1264ee8b453d7549dd7cdd6110a4ed/packages/grid/x-data-grid/src/hooks/features/columns/gridColumnsUtils.ts#L446:L453
        return;
      }

      columnsState.lookup[field] = _extends({}, columnsState.lookup[field], {
        groupPath: (_unwrappedGroupingMod2 = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod2 : []
      });
    });
    return columnsState;
  }, [props.columnGroupingModel, (_props$experimentalFe2 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe2.columnGrouping]);
  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', addHeaderGroups);
};