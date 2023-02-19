"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridFilter = exports.filterStateInitializer = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _gridFeatureMode = require("../../../models/gridFeatureMode");

var _useGridApiEventHandler = require("../../utils/useGridApiEventHandler");

var _useGridApiMethod = require("../../utils/useGridApiMethod");

var _useGridLogger = require("../../utils/useGridLogger");

var _gridColumnsSelector = require("../columns/gridColumnsSelector");

var _gridPreferencePanelsValue = require("../preferencesPanel/gridPreferencePanelsValue");

var _gridFilterState = require("./gridFilterState");

var _gridFilterSelector = require("./gridFilterSelector");

var _useFirstRender = require("../../utils/useFirstRender");

var _rows = require("../rows");

var _pipeProcessing = require("../../core/pipeProcessing");

var _strategyProcessing = require("../../core/strategyProcessing");

var _gridFilterUtils = require("./gridFilterUtils");

var _utils = require("../../../utils/utils");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const filterStateInitializer = (state, props, apiRef) => {
  var _ref, _props$filterModel, _props$initialState, _props$initialState$f;

  const filterModel = (_ref = (_props$filterModel = props.filterModel) != null ? _props$filterModel : (_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$f = _props$initialState.filter) == null ? void 0 : _props$initialState$f.filterModel) != null ? _ref : (0, _gridFilterState.getDefaultGridFilterModel)();
  return (0, _extends2.default)({}, state, {
    filter: {
      filterModel: (0, _gridFilterUtils.sanitizeFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef),
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


exports.filterStateInitializer = filterStateInitializer;

const useGridFilter = (apiRef, props) => {
  var _props$initialState3, _props$initialState3$, _props$componentsProp2;

  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridFilter');
  apiRef.current.unstable_registerControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: _gridFilterSelector.gridFilterModelSelector,
    changeEvent: 'filterModelChange'
  });
  const updateFilteredRows = React.useCallback(() => {
    apiRef.current.setState(state => {
      const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(state, apiRef.current.instanceId);
      const isRowMatchingFilters = props.filterMode === _gridFeatureMode.GridFeatureModeConstant.client ? (0, _gridFilterUtils.buildAggregatedFilterApplier)(filterModel, apiRef) : null;
      const filteringResult = apiRef.current.unstable_applyStrategyProcessor('filtering', {
        isRowMatchingFilters,
        filterModel: filterModel != null ? filterModel : (0, _gridFilterState.getDefaultGridFilterModel)()
      });
      return (0, _extends2.default)({}, state, {
        filter: (0, _extends2.default)({}, state.filter, filteringResult)
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
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const items = [...filterModel.items];
    const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);

    if (itemIndex === -1) {
      items.push(item);
    } else {
      items[itemIndex] = item;
    }

    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'upsertFilterItem');
  }, [apiRef]);
  const upsertFilterItems = React.useCallback(items => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const existingItems = [...filterModel.items];
    items.forEach(item => {
      const itemIndex = items.findIndex(filterItem => filterItem.id === item.id);

      if (itemIndex === -1) {
        existingItems.push(item);
      } else {
        existingItems[itemIndex] = item;
      }
    });
    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'upsertFilterItems');
  }, [apiRef]);
  const deleteFilterItem = React.useCallback(itemToDelete => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const items = filterModel.items.filter(item => item.id !== itemToDelete.id);

    if (items.length === filterModel.items.length) {
      return;
    }

    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      items
    }), 'deleteFilterItem');
  }, [apiRef]);
  const showFilterPanel = React.useCallback(targetColumnField => {
    logger.debug('Displaying filter panel');

    if (targetColumnField) {
      const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
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
        newFilterItems = [(0, _gridFilterUtils.cleanFilterItem)({
          columnField: targetColumnField
        }, apiRef)];
      } else {
        newFilterItems = [...filterItemsWithValue, (0, _gridFilterUtils.cleanFilterItem)({
          columnField: targetColumnField
        }, apiRef)];
      }

      apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
        items: newFilterItems
      }));
    }

    apiRef.current.showPreferences(_gridPreferencePanelsValue.GridPreferencePanelsValue.filters);
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const hideFilterPanel = React.useCallback(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);
  const setFilterLinkOperator = React.useCallback(linkOperator => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);

    if (filterModel.linkOperator === linkOperator) {
      return;
    }

    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      linkOperator
    }), 'changeLogicOperator');
  }, [apiRef]);
  const setQuickFilterValues = React.useCallback(values => {
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);

    if ((0, _utils.isDeepEqual)(filterModel.quickFilterValues, values)) {
      return;
    }

    apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
      quickFilterValues: [...values]
    }));
  }, [apiRef]);
  const setFilterModel = React.useCallback((model, reason) => {
    const currentModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);

    if (currentModel !== model) {
      logger.debug('Setting filter model');
      apiRef.current.unstable_updateControlState('filter', (0, _gridFilterUtils.mergeStateWithFilterModel)(model, props.disableMultipleColumnsFiltering, apiRef), reason);
      apiRef.current.unstable_applyFilters();
    }
  }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
  const getVisibleRowModels = React.useCallback(() => {
    const visibleSortedRows = (0, _gridFilterSelector.gridVisibleSortedRowEntriesSelector)(apiRef);
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
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, filterApi, 'GridFilterApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    var _props$initialState2, _props$initialState2$;

    const filterModelToExport = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const shouldExportFilterModel = // Always export if the `exportOnlyDirtyModels` property is activated
    !context.exportOnlyDirtyModels || // Always export if the model is controlled
    props.filterModel != null || // Always export if the model has been initialized
    ((_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.filter) == null ? void 0 : _props$initialState2$.filterModel) != null || // Export if the model is not equal to the default value
    !(0, _utils.isDeepEqual)(filterModelToExport, (0, _gridFilterState.getDefaultGridFilterModel)());

    if (!shouldExportFilterModel) {
      return prevState;
    }

    return (0, _extends2.default)({}, prevState, {
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

    apiRef.current.unstable_updateControlState('filter', (0, _gridFilterUtils.mergeStateWithFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef), 'restoreState');
    return (0, _extends2.default)({}, params, {
      callbacks: [...params.callbacks, apiRef.current.unstable_applyFilters]
    });
  }, [apiRef, props.disableMultipleColumnsFiltering]);
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === _gridPreferencePanelsValue.GridPreferencePanelsValue.filters) {
      var _props$componentsProp;

      const FilterPanel = props.components.FilterPanel;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(FilterPanel, (0, _extends2.default)({}, (_props$componentsProp = props.componentsProps) == null ? void 0 : _props$componentsProp.filterPanel));
    }

    return initialValue;
  }, [props.components.FilterPanel, (_props$componentsProp2 = props.componentsProps) == null ? void 0 : _props$componentsProp2.filterPanel]);
  const flatFilteringMethod = React.useCallback(params => {
    if (props.filterMode === _gridFeatureMode.GridFeatureModeConstant.client && params.isRowMatchingFilters) {
      const rowIds = (0, _rows.gridRowIdsSelector)(apiRef);
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
          isRowPassing = (0, _gridFilterUtils.passFilterLogic)([passingFilterItems], [passingQuickFilterValues], params.filterModel, apiRef);
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
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  (0, _strategyProcessing.useGridRegisterStrategyProcessor)(apiRef, _strategyProcessing.GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);
  /**
   * EVENTS
   */

  const handleColumnsChange = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = (0, _gridFilterSelector.gridFilterModelSelector)(apiRef);
    const filterableColumnsLookup = (0, _gridColumnsSelector.gridFilterableColumnLookupSelector)(apiRef);
    const newFilterItems = filterModel.items.filter(item => item.columnField && filterableColumnsLookup[item.columnField]);

    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel((0, _extends2.default)({}, filterModel, {
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

  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowsSet', updateFilteredRows);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'rowExpansionChange', apiRef.current.unstable_applyFilters);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'columnsChange', handleColumnsChange);
  (0, _useGridApiEventHandler.useGridApiEventHandler)(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
  /**
   * 1ST RENDER
   */

  (0, _useFirstRender.useFirstRender)(() => {
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

exports.useGridFilter = useGridFilter;