import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridFilterableColumnLookupSelector } from '../columns/gridColumnsSelector';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { getDefaultGridFilterModel } from './gridFilterState';
import { gridFilterModelSelector, gridVisibleSortedRowEntriesSelector } from './gridFilterSelector';
import { useFirstRender } from '../../utils/useFirstRender';
import { gridRowIdsSelector } from '../rows';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { GRID_DEFAULT_STRATEGY, useGridRegisterStrategyProcessor } from '../../core/strategyProcessing';
import { buildAggregatedFilterApplier, sanitizeFilterModel, mergeStateWithFilterModel, cleanFilterItem, passFilterLogic } from './gridFilterUtils';
import { isDeepEqual } from '../../../utils/utils';
import { jsx as _jsx } from "react/jsx-runtime";
export const filterStateInitializer = (state, props, apiRef) => {
  var _ref, _props$filterModel, _props$initialState, _props$initialState$f;

  const filterModel = (_ref = (_props$filterModel = props.filterModel) != null ? _props$filterModel : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$f = _props$initialState.filter) == null ? void 0 : _props$initialState$f.filterModel) != null ? _ref : getDefaultGridFilterModel();
  return _extends({}, state, {
    filter: {
      filterModel: sanitizeFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef),
      visibleRowsLookup: {},
      filteredDescendantCountLookup: {}
    }
  });
};
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */

export const useGridFilter = (apiRef, props) => {
  var _props$initialState3, _props$initialState3$, _props$componentsProp2;

  const logger = useGridLogger(apiRef, 'useGridFilter');
  apiRef.current.unstable_registerControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: 'filterModelChange'
  });
  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState(state => {
      const filterModel = gridFilterModelSelector(state, apiRef.current.instanceId);
      const isRowMatchingFilters = props.filterMode === GridFeatureModeConstant.client ? buildAggregatedFilterApplier(filterModel, apiRef) : null;
      const filteringResult = apiRef.current.unstable_applyStrategyProcessor('filtering', {
        isRowMatchingFilters,
        filterModel: filterModel != null ? filterModel : getDefaultGridFilterModel()
      });
      return _extends({}, state, {
        filter: _extends({}, state.filter, filteringResult)
      });
    });
    apiRef.current.publishEvent('filteredRowsSet');
  }, [props.filterMode, apiRef]);
  /**
   * API METHODS
   */

  const applyFilters = React.useCallback(() => {
    updateFilteredRows();
    apiRef.current.forceUpdate();
  }, [apiRef, updateFilteredRows]);
  const upsertFilterItem = React.useCallback(item => {
    const filterModel = gridFilterModelSelector(apiRef);
    const items = [...filterModel.items];
    const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);

    if (itemIndex === -1) {
      items.push(item);
    } else {
      items[itemIndex] = item;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items
    }), 'upsertFilterItem');
  }, [apiRef]);
  const upsertFilterItems = React.useCallback(items => {
    const filterModel = gridFilterModelSelector(apiRef);
    const existingItems = [...filterModel.items];
    items.forEach(item => {
      const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);

      if (itemIndex === -1) {
        existingItems.push(item);
      } else {
        existingItems[itemIndex] = item;
      }
    });
    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items
    }), 'upsertFilterItems');
  }, [apiRef]);
  const deleteFilterItem = React.useCallback(itemToDelete => {
    const filterModel = gridFilterModelSelector(apiRef);
    const items = filterModel.items.filter(item => item.id !== itemToDelete.id);

    if (items.length === filterModel.items.length) {
      return;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      items
    }), 'deleteFilterItem');
  }, [apiRef]);
  const showFilterPanel = React.useCallback(targetColumnField => {
    logger.debug('Displaying filter panel');

    if (targetColumnField) {
      const filterModel = gridFilterModelSelector(apiRef);
      const filterItemsWithValue = filterModel.items.filter(item => {
        var _column$filterOperato;

        if (item.value !== undefined) {
          return true;
        }

        const column = apiRef.current.getColumn(item.columnField);
        const filterOperator = (_column$filterOperato = column.filterOperators) == null ? void 0 : _column$filterOperato.find(operator => operator.value === item.operatorValue);
        const requiresFilterValue = typeof (filterOperator == null ? void 0 : filterOperator.requiresFilterValue) === 'undefined' ? true : filterOperator == null ? void 0 : filterOperator.requiresFilterValue; // Operators like `isEmpty` don't have and don't require `item.value`.
        // So we don't want to remove them from the filter model if `item.value === undefined`.
        // See https://github.com/mui/mui-x/issues/5402

        if (requiresFilterValue) {
          return false;
        }

        return true;
      });
      let newFilterItems;
      const filterItemOnTarget = filterItemsWithValue.find(item => item.columnField === targetColumnField);

      if (filterItemOnTarget) {
        newFilterItems = filterItemsWithValue;
      } else if (props.disableMultipleColumnsFiltering) {
        newFilterItems = [cleanFilterItem({
          columnField: targetColumnField
        }, apiRef)];
      } else {
        newFilterItems = [...filterItemsWithValue, cleanFilterItem({
          columnField: targetColumnField
        }, apiRef)];
      }

      apiRef.current.setFilterModel(_extends({}, filterModel, {
        items: newFilterItems
      }));
    }

    apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);
  const setFilterLinkOperator = React.useCallback(linkOperator => {
    const filterModel = gridFilterModelSelector(apiRef);

    if (filterModel.linkOperator === linkOperator) {
      return;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      linkOperator
    }), 'changeLogicOperator');
  }, [apiRef]);
  const setQuickFilterValues = React.useCallback(values => {
    const filterModel = gridFilterModelSelector(apiRef);

    if (isDeepEqual(filterModel.quickFilterValues, values)) {
      return;
    }

    apiRef.current.setFilterModel(_extends({}, filterModel, {
      quickFilterValues: [...values]
    }));
  }, [apiRef]);
  const setFilterModel = React.useCallback((model, reason) => {
    const currentModel = gridFilterModelSelector(apiRef);

    if (currentModel !== model) {
      logger.debug('Setting filter model');
      apiRef.current.unstable_updateControlState('filter', mergeStateWithFilterModel(model, props.disableMultipleColumnsFiltering, apiRef), reason);
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const getVisibleRowModels = React.useCallback(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    return new Map(visibleSortedRows.map(row => [row.id, row.model]));
  }, [apiRef]);
  const filterApi = {
    setFilterLinkOperator,
    unstable_applyFilters: applyFilters,
    deleteFilterItem,
    upsertFilterItem,
    upsertFilterItems,
    setFilterModel,
    showFilterPanel,
    hideFilterPanel,
    getVisibleRowModels,
    setQuickFilterValues
  };
  useGridApiMethod(apiRef, filterApi, 'GridFilterApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    var _props$initialState2, _props$initialState2$;

    const filterModelToExport = gridFilterModelSelector(apiRef);
    const shouldExportFilterModel = // Always export if the `exportOnlyDirtyModels` property is activated
    !context.exportOnlyDirtyModels || // Always export if the model is controlled
    props.filterModel != null || // Always export if the model has been initialized
    ((_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.filter) == null ? void 0 : _props$initialState2$.filterModel) != null || // Export if the model is not equal to the default value
    !isDeepEqual(filterModelToExport, getDefaultGridFilterModel());

    if (!shouldExportFilterModel) {
      return prevState;
    }

    return _extends({}, prevState, {
      filter: {
        filterModel: filterModelToExport
      }
    });
  }, [apiRef, props.filterModel, (_props$initialState3 = props.initialState) == null ? void 0 : (_props$initialState3$ = _props$initialState3.filter) == null ? void 0 : _props$initialState3$.filterModel]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    var _context$stateToResto;

    const filterModel = (_context$stateToResto = context.stateToRestore.filter) == null ? void 0 : _context$stateToResto.filterModel;

    if (filterModel == null) {
      return params;
    }

    apiRef.current.unstable_updateControlState('filter', mergeStateWithFilterModel(filterModel, props.disableMultipleColumnsFiltering, apiRef), 'restoreState');
    return _extends({}, params, {
      callbacks: [...params.callbacks, apiRef.current.unstable_applyFilters]
    });
  }, [apiRef, props.disableMultipleColumnsFiltering]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === GridPreferencePanelsValue.filters) {
      var _props$componentsProp;

      const FilterPanel = props.components.FilterPanel;
      return /*#__PURE__*/_jsx(FilterPanel, _extends({}, (_props$componentsProp = props.componentsProps) == null ? void 0 : _props$componentsProp.filterPanel));
    }

    return initialValue;
  }, [props.components.FilterPanel, (_props$componentsProp2 = props.componentsProps) == null ? void 0 : _props$componentsProp2.filterPanel]);
  const flatFilteringMethod = React.useCallback(params => {
    if (props.filterMode === GridFeatureModeConstant.client && params.isRowMatchingFilters) {
      const rowIds = gridRowIdsSelector(apiRef);
      const filteredRowsLookup = {};

      for (let i = 0; i < rowIds.length; i += 1) {
        const rowId = rowIds[i];
        let isRowPassing;

        if (typeof rowId === 'string' && rowId.startsWith('auto-generated-group-footer')) {
          isRowPassing = true;
        } else {
          const {
            passingFilterItems,
            passingQuickFilterValues
          } = params.isRowMatchingFilters(rowId);
          isRowPassing = passFilterLogic([passingFilterItems], [passingQuickFilterValues], params.filterModel, apiRef);
        }

        filteredRowsLookup[rowId] = isRowPassing;
      }

      return {
        filteredRowsLookup,
        // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` since no row is collapsed.
        visibleRowsLookup: filteredRowsLookup,
        filteredDescendantCountLookup: {}
      };
    }

    return {
      visibleRowsLookup: {},
      filteredRowsLookup: {},
      filteredDescendantCountLookup: {}
    };
  }, [apiRef, props.filterMode]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);
  /**
   * EVENTS
   */

  const handleColumnsChange = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef);
    const filterableColumnsLookup = gridFilterableColumnLookupSelector(apiRef);
    const newFilterItems = filterModel.items.filter(item => item.columnField && filterableColumnsLookup[item.columnField]);

    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel(_extends({}, filterModel, {
        items: newFilterItems
      }));
    }
  }, [apiRef, logger]);
  const handleStrategyProcessorChange = React.useCallback(methodName => {
    if (methodName === 'filtering') {
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef]); // Do not call `apiRef.current.forceUpdate` to avoid re-render before updating the sorted rows.
  // Otherwise, the state is not consistent during the render

  useGridApiEventHandler(apiRef, 'rowsSet', updateFilteredRows);
  useGridApiEventHandler(apiRef, 'rowExpansionChange', apiRef.current.unstable_applyFilters);
  useGridApiEventHandler(apiRef, 'columnsChange', handleColumnsChange);
  useGridApiEventHandler(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
  /**
   * 1ST RENDER
   */

  useFirstRender(() => {
    apiRef.current.unstable_applyFilters();
  });
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);
};