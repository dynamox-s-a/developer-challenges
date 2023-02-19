import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnFieldsSelector, gridColumnDefinitionsSelector, gridColumnLookupSelector, gridColumnsMetaSelector, gridColumnsSelector, gridColumnVisibilityModelSelector, gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector } from './gridColumnsSelector';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { useGridRegisterPipeProcessor, useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { hydrateColumnsWidth, computeColumnTypes, createColumnsState, mergeColumnsState, COLUMNS_DIMENSION_PROPERTIES } from './gridColumnsUtils';
import { GridPreferencePanelsValue } from '../preferencesPanel';
import { jsx as _jsx } from "react/jsx-runtime";
export var columnsStateInitializer = function columnsStateInitializer(state, props, apiRef) {
  var _props$initialState, _props$initialState$c, _props$initialState2, _ref, _props$columnVisibili, _props$initialState3, _props$initialState3$;

  var isUsingColumnVisibilityModel = !!props.columnVisibilityModel || !!((_props$initialState = props.initialState) != null && (_props$initialState$c = _props$initialState.columns) != null && _props$initialState$c.columnVisibilityModel);
  apiRef.current.unstable_caches.columns = {
    isUsingColumnVisibilityModel: isUsingColumnVisibilityModel
  };
  var columnsTypes = computeColumnTypes(props.columnTypes);
  var columnsState = createColumnsState({
    apiRef: apiRef,
    columnTypes: columnsTypes,
    columnsToUpsert: props.columns,
    initialState: (_props$initialState2 = props.initialState) == null ? void 0 : _props$initialState2.columns,
    shouldRegenColumnVisibilityModelFromColumns: !isUsingColumnVisibilityModel,
    currentColumnVisibilityModel: (_ref = (_props$columnVisibili = props.columnVisibilityModel) != null ? _props$columnVisibili : (_props$initialState3 = props.initialState) == null ? void 0 : (_props$initialState3$ = _props$initialState3.columns) == null ? void 0 : _props$initialState3$.columnVisibilityModel) != null ? _ref : {},
    keepOnlyColumnsToUpsert: true
  });
  return _extends({}, state, {
    columns: columnsState
  });
};
/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */

export function useGridColumns(apiRef, props) {
  var _props$initialState5, _props$componentsProp2;

  var logger = useGridLogger(apiRef, 'useGridColumns');
  var columnTypes = React.useMemo(function () {
    return computeColumnTypes(props.columnTypes);
  }, [props.columnTypes]);
  var previousColumnsProp = React.useRef(props.columns);
  var previousColumnTypesProp = React.useRef(columnTypes);
  apiRef.current.unstable_registerControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: gridColumnVisibilityModelSelector,
    changeEvent: 'columnVisibilityModelChange'
  });
  var setGridColumnsState = React.useCallback(function (columnsState) {
    logger.debug('Updating columns state.');
    apiRef.current.setState(mergeColumnsState(columnsState));
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent('columnsChange', columnsState.all);
  }, [logger, apiRef]);
  /**
   * API METHODS
   */

  var getColumn = React.useCallback(function (field) {
    return gridColumnLookupSelector(apiRef)[field];
  }, [apiRef]);
  var getAllColumns = React.useCallback(function () {
    return gridColumnDefinitionsSelector(apiRef);
  }, [apiRef]);
  var getVisibleColumns = React.useCallback(function () {
    return gridVisibleColumnDefinitionsSelector(apiRef);
  }, [apiRef]);
  var getColumnsMeta = React.useCallback(function () {
    return gridColumnsMetaSelector(apiRef);
  }, [apiRef]);
  var getColumnIndex = React.useCallback(function (field) {
    var useVisibleColumns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var columns = useVisibleColumns ? gridVisibleColumnDefinitionsSelector(apiRef) : gridColumnDefinitionsSelector(apiRef);
    return columns.findIndex(function (col) {
      return col.field === field;
    });
  }, [apiRef]);
  var getColumnPosition = React.useCallback(function (field) {
    var index = getColumnIndex(field);
    return gridColumnPositionsSelector(apiRef)[index];
  }, [apiRef, getColumnIndex]);
  var setColumnVisibilityModel = React.useCallback(function (model) {
    var currentModel = gridColumnVisibilityModelSelector(apiRef);

    if (currentModel !== model) {
      apiRef.current.setState(function (state) {
        return _extends({}, state, {
          columns: createColumnsState({
            apiRef: apiRef,
            columnTypes: columnTypes,
            columnsToUpsert: [],
            initialState: undefined,
            shouldRegenColumnVisibilityModelFromColumns: false,
            currentColumnVisibilityModel: model,
            keepOnlyColumnsToUpsert: false
          })
        });
      });
      apiRef.current.forceUpdate();
    }
  }, [apiRef, columnTypes]);
  var updateColumns = React.useCallback(function (columns) {
    var columnsState = createColumnsState({
      apiRef: apiRef,
      columnTypes: columnTypes,
      columnsToUpsert: columns,
      initialState: undefined,
      shouldRegenColumnVisibilityModelFromColumns: true,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, setGridColumnsState, columnTypes]);
  var updateColumn = React.useCallback(function (column) {
    return apiRef.current.updateColumns([column]);
  }, [apiRef]);
  var setColumnVisibility = React.useCallback(function (field, isVisible) {
    // We keep updating the `hide` option of `GridColDef` when not controlling the model to avoid any breaking change.
    // `updateColumns` take care of updating the model itself if needs be.
    // TODO v6: stop using the `hide` field even when the model is not defined
    if (apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel) {
      var _columnVisibilityMode;

      var columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
      var isCurrentlyVisible = (_columnVisibilityMode = columnVisibilityModel[field]) != null ? _columnVisibilityMode : true;

      if (isVisible !== isCurrentlyVisible) {
        var newModel = _extends({}, columnVisibilityModel, _defineProperty({}, field, isVisible));

        apiRef.current.setColumnVisibilityModel(newModel);
      }
    } else {
      var column = apiRef.current.getColumn(field);

      var newColumn = _extends({}, column, {
        hide: !isVisible
      });

      apiRef.current.updateColumns([newColumn]);
      var params = {
        field: field,
        colDef: newColumn,
        isVisible: isVisible
      };
      apiRef.current.publishEvent('columnVisibilityChange', params);
    }
  }, [apiRef]);
  var setColumnIndex = React.useCallback(function (field, targetIndexPosition) {
    var allColumns = gridColumnFieldsSelector(apiRef);
    var oldIndexPosition = allColumns.findIndex(function (col) {
      return col === field;
    });

    if (oldIndexPosition === targetIndexPosition) {
      return;
    }

    logger.debug("Moving column ".concat(field, " to index ").concat(targetIndexPosition));

    var updatedColumns = _toConsumableArray(allColumns);

    var fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
    updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
    setGridColumnsState(_extends({}, gridColumnsSelector(apiRef.current.state), {
      all: updatedColumns
    }));
    var params = {
      field: field,
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: apiRef.current.getColumn(field),
      targetIndex: targetIndexPosition,
      oldIndex: oldIndexPosition
    };
    apiRef.current.publishEvent('columnOrderChange', params);
  }, [apiRef, logger, setGridColumnsState]);
  var setColumnWidth = React.useCallback(function (field, width) {
    logger.debug("Updating column ".concat(field, " width to ").concat(width));
    var column = apiRef.current.getColumn(field);

    var newColumn = _extends({}, column, {
      width: width
    });

    apiRef.current.updateColumns([newColumn]);
    apiRef.current.publishEvent('columnWidthChange', {
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: newColumn,
      width: width
    });
  }, [apiRef, logger]);
  var columnApi = {
    getColumn: getColumn,
    getAllColumns: getAllColumns,
    getColumnIndex: getColumnIndex,
    getColumnPosition: getColumnPosition,
    getVisibleColumns: getVisibleColumns,
    getColumnsMeta: getColumnsMeta,
    updateColumn: updateColumn,
    updateColumns: updateColumns,
    setColumnVisibilityModel: setColumnVisibilityModel,
    setColumnVisibility: setColumnVisibility,
    setColumnIndex: setColumnIndex,
    setColumnWidth: setColumnWidth
  };
  useGridApiMethod(apiRef, columnApi, 'GridColumnApi');
  /**
   * PRE-PROCESSING
   */

  var stateExportPreProcessing = React.useCallback(function (prevState, context) {
    var columnsStateToExport = {};

    if (apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel) {
      var _props$initialState$c2, _props$initialState4, _props$initialState4$;

      var columnVisibilityModelToExport = gridColumnVisibilityModelSelector(apiRef);
      var shouldExportColumnVisibilityModel = // Always export if the `exportOnlyDirtyModels` property is activated
      !context.exportOnlyDirtyModels || // Always export if the model is controlled
      props.columnVisibilityModel != null || // Always export if the model has been initialized
      // TODO v6 Do a nullish check instead to export even if the initial model equals "{}"
      Object.keys((_props$initialState$c2 = (_props$initialState4 = props.initialState) == null ? void 0 : (_props$initialState4$ = _props$initialState4.columns) == null ? void 0 : _props$initialState4$.columnVisibilityModel) != null ? _props$initialState$c2 : {}).length > 0 || // Always export if the model is not empty
      Object.keys(columnVisibilityModelToExport).length > 0;

      if (shouldExportColumnVisibilityModel) {
        columnsStateToExport.columnVisibilityModel = columnVisibilityModelToExport;
      }
    }

    columnsStateToExport.orderedFields = gridColumnFieldsSelector(apiRef);
    var columns = gridColumnDefinitionsSelector(apiRef);
    var dimensions = {};
    columns.forEach(function (colDef) {
      if (colDef.hasBeenResized) {
        var colDefDimensions = {};
        COLUMNS_DIMENSION_PROPERTIES.forEach(function (propertyName) {
          var propertyValue = colDef[propertyName];

          if (propertyValue === Infinity) {
            propertyValue = -1;
          }

          colDefDimensions[propertyName] = propertyValue;
        });
        dimensions[colDef.field] = colDefDimensions;
      }
    });

    if (Object.keys(dimensions).length > 0) {
      columnsStateToExport.dimensions = dimensions;
    }

    return _extends({}, prevState, {
      columns: columnsStateToExport
    });
  }, [apiRef, props.columnVisibilityModel, (_props$initialState5 = props.initialState) == null ? void 0 : _props$initialState5.columns]);
  var stateRestorePreProcessing = React.useCallback(function (params, context) {
    var _context$stateToResto;

    var columnVisibilityModelToImport = apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel ? (_context$stateToResto = context.stateToRestore.columns) == null ? void 0 : _context$stateToResto.columnVisibilityModel : undefined;
    var initialState = context.stateToRestore.columns;

    if (columnVisibilityModelToImport == null && initialState == null) {
      return params;
    }

    var columnsState = createColumnsState({
      apiRef: apiRef,
      columnTypes: columnTypes,
      columnsToUpsert: [],
      initialState: initialState,
      shouldRegenColumnVisibilityModelFromColumns: !apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel,
      currentColumnVisibilityModel: columnVisibilityModelToImport,
      keepOnlyColumnsToUpsert: false
    });
    apiRef.current.setState(mergeColumnsState(columnsState));

    if (initialState != null) {
      apiRef.current.publishEvent('columnsChange', columnsState.all);
    }

    return params;
  }, [apiRef, columnTypes]);
  var preferencePanelPreProcessing = React.useCallback(function (initialValue, value) {
    if (value === GridPreferencePanelsValue.columns) {
      var _props$componentsProp;

      var ColumnsPanel = props.components.ColumnsPanel;
      return /*#__PURE__*/_jsx(ColumnsPanel, _extends({}, (_props$componentsProp = props.componentsProps) == null ? void 0 : _props$componentsProp.columnsPanel));
    }

    return initialValue;
  }, [props.components.ColumnsPanel, (_props$componentsProp2 = props.componentsProps) == null ? void 0 : _props$componentsProp2.columnsPanel]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
  /**
   * EVENTS
   */

  var prevInnerWidth = React.useRef(null);

  var handleGridSizeChange = function handleGridSizeChange(viewportInnerSize) {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      setGridColumnsState(hydrateColumnsWidth(gridColumnsSelector(apiRef.current.state), viewportInnerSize.width));
    }
  };

  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
  useGridApiOptionHandler(apiRef, 'columnVisibilityChange', props.onColumnVisibilityChange);
  /**
   * APPLIERS
   */

  var hydrateColumns = React.useCallback(function () {
    logger.info("Columns pipe processing have changed, regenerating the columns");
    var columnsState = createColumnsState({
      apiRef: apiRef,
      columnTypes: columnTypes,
      columnsToUpsert: [],
      initialState: undefined,
      shouldRegenColumnVisibilityModelFromColumns: !apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, logger, setGridColumnsState, columnTypes]);
  useGridRegisterPipeApplier(apiRef, 'hydrateColumns', hydrateColumns);
  /**
   * EFFECTS
   */
  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one

  var isFirstRender = React.useRef(true);
  React.useEffect(function () {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    logger.info("GridColumns have changed, new length ".concat(props.columns.length));

    if (previousColumnsProp.current === props.columns && previousColumnTypesProp.current === columnTypes) {
      return;
    }

    var columnsState = createColumnsState({
      apiRef: apiRef,
      columnTypes: columnTypes,
      initialState: undefined,
      // If the user provides a model, we don't want to set it in the state here because it has it's dedicated `useEffect` which calls `setColumnVisibilityModel`
      shouldRegenColumnVisibilityModelFromColumns: !apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel,
      columnsToUpsert: props.columns,
      keepOnlyColumnsToUpsert: true
    });
    previousColumnsProp.current = props.columns;
    previousColumnTypesProp.current = columnTypes;
    setGridColumnsState(columnsState);
  }, [logger, apiRef, setGridColumnsState, props.columns, columnTypes]);
  React.useEffect(function () {
    if (props.columnVisibilityModel !== undefined) {
      apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
    }
  }, [apiRef, logger, props.columnVisibilityModel]);
}