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
export const columnsStateInitializer = (state, props, apiRef) => {
  var _props$initialState, _props$initialState$c, _props$initialState2, _ref, _props$columnVisibili, _props$initialState3, _props$initialState3$;

  const isUsingColumnVisibilityModel = !!props.columnVisibilityModel || !!((_props$initialState = props.initialState) != null && (_props$initialState$c = _props$initialState.columns) != null && _props$initialState$c.columnVisibilityModel);
  apiRef.current.unstable_caches.columns = {
    isUsingColumnVisibilityModel
  };
  const columnsTypes = computeColumnTypes(props.columnTypes);
  const columnsState = createColumnsState({
    apiRef,
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

  const logger = useGridLogger(apiRef, 'useGridColumns');
  const columnTypes = React.useMemo(() => computeColumnTypes(props.columnTypes), [props.columnTypes]);
  const previousColumnsProp = React.useRef(props.columns);
  const previousColumnTypesProp = React.useRef(columnTypes);
  apiRef.current.unstable_registerControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: gridColumnVisibilityModelSelector,
    changeEvent: 'columnVisibilityModelChange'
  });
  const setGridColumnsState = React.useCallback(columnsState => {
    logger.debug('Updating columns state.');
    apiRef.current.setState(mergeColumnsState(columnsState));
    apiRef.current.forceUpdate();
    apiRef.current.publishEvent('columnsChange', columnsState.all);
  }, [logger, apiRef]);
  /**
   * API METHODS
   */

  const getColumn = React.useCallback(field => gridColumnLookupSelector(apiRef)[field], [apiRef]);
  const getAllColumns = React.useCallback(() => gridColumnDefinitionsSelector(apiRef), [apiRef]);
  const getVisibleColumns = React.useCallback(() => gridVisibleColumnDefinitionsSelector(apiRef), [apiRef]);
  const getColumnsMeta = React.useCallback(() => gridColumnsMetaSelector(apiRef), [apiRef]);
  const getColumnIndex = React.useCallback((field, useVisibleColumns = true) => {
    const columns = useVisibleColumns ? gridVisibleColumnDefinitionsSelector(apiRef) : gridColumnDefinitionsSelector(apiRef);
    return columns.findIndex(col => col.field === field);
  }, [apiRef]);
  const getColumnPosition = React.useCallback(field => {
    const index = getColumnIndex(field);
    return gridColumnPositionsSelector(apiRef)[index];
  }, [apiRef, getColumnIndex]);
  const setColumnVisibilityModel = React.useCallback(model => {
    const currentModel = gridColumnVisibilityModelSelector(apiRef);

    if (currentModel !== model) {
      apiRef.current.setState(state => _extends({}, state, {
        columns: createColumnsState({
          apiRef,
          columnTypes,
          columnsToUpsert: [],
          initialState: undefined,
          shouldRegenColumnVisibilityModelFromColumns: false,
          currentColumnVisibilityModel: model,
          keepOnlyColumnsToUpsert: false
        })
      }));
      apiRef.current.forceUpdate();
    }
  }, [apiRef, columnTypes]);
  const updateColumns = React.useCallback(columns => {
    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: columns,
      initialState: undefined,
      shouldRegenColumnVisibilityModelFromColumns: true,
      keepOnlyColumnsToUpsert: false
    });
    setGridColumnsState(columnsState);
  }, [apiRef, setGridColumnsState, columnTypes]);
  const updateColumn = React.useCallback(column => apiRef.current.updateColumns([column]), [apiRef]);
  const setColumnVisibility = React.useCallback((field, isVisible) => {
    // We keep updating the `hide` option of `GridColDef` when not controlling the model to avoid any breaking change.
    // `updateColumns` take care of updating the model itself if needs be.
    // TODO v6: stop using the `hide` field even when the model is not defined
    if (apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel) {
      var _columnVisibilityMode;

      const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
      const isCurrentlyVisible = (_columnVisibilityMode = columnVisibilityModel[field]) != null ? _columnVisibilityMode : true;

      if (isVisible !== isCurrentlyVisible) {
        const newModel = _extends({}, columnVisibilityModel, {
          [field]: isVisible
        });

        apiRef.current.setColumnVisibilityModel(newModel);
      }
    } else {
      const column = apiRef.current.getColumn(field);

      const newColumn = _extends({}, column, {
        hide: !isVisible
      });

      apiRef.current.updateColumns([newColumn]);
      const params = {
        field,
        colDef: newColumn,
        isVisible
      };
      apiRef.current.publishEvent('columnVisibilityChange', params);
    }
  }, [apiRef]);
  const setColumnIndex = React.useCallback((field, targetIndexPosition) => {
    const allColumns = gridColumnFieldsSelector(apiRef);
    const oldIndexPosition = allColumns.findIndex(col => col === field);

    if (oldIndexPosition === targetIndexPosition) {
      return;
    }

    logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);
    const updatedColumns = [...allColumns];
    const fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
    updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
    setGridColumnsState(_extends({}, gridColumnsSelector(apiRef.current.state), {
      all: updatedColumns
    }));
    const params = {
      field,
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: apiRef.current.getColumn(field),
      targetIndex: targetIndexPosition,
      oldIndex: oldIndexPosition
    };
    apiRef.current.publishEvent('columnOrderChange', params);
  }, [apiRef, logger, setGridColumnsState]);
  const setColumnWidth = React.useCallback((field, width) => {
    logger.debug(`Updating column ${field} width to ${width}`);
    const column = apiRef.current.getColumn(field);

    const newColumn = _extends({}, column, {
      width
    });

    apiRef.current.updateColumns([newColumn]);
    apiRef.current.publishEvent('columnWidthChange', {
      element: apiRef.current.getColumnHeaderElement(field),
      colDef: newColumn,
      width
    });
  }, [apiRef, logger]);
  const columnApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
    setColumnVisibilityModel,
    setColumnVisibility,
    setColumnIndex,
    setColumnWidth
  };
  useGridApiMethod(apiRef, columnApi, 'GridColumnApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const columnsStateToExport = {};

    if (apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel) {
      var _props$initialState$c2, _props$initialState4, _props$initialState4$;

      const columnVisibilityModelToExport = gridColumnVisibilityModelSelector(apiRef);
      const shouldExportColumnVisibilityModel = // Always export if the `exportOnlyDirtyModels` property is activated
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
    const columns = gridColumnDefinitionsSelector(apiRef);
    const dimensions = {};
    columns.forEach(colDef => {
      if (colDef.hasBeenResized) {
        const colDefDimensions = {};
        COLUMNS_DIMENSION_PROPERTIES.forEach(propertyName => {
          let propertyValue = colDef[propertyName];

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
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    var _context$stateToResto;

    const columnVisibilityModelToImport = apiRef.current.unstable_caches.columns.isUsingColumnVisibilityModel ? (_context$stateToResto = context.stateToRestore.columns) == null ? void 0 : _context$stateToResto.columnVisibilityModel : undefined;
    const initialState = context.stateToRestore.columns;

    if (columnVisibilityModelToImport == null && initialState == null) {
      return params;
    }

    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState,
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
  const preferencePanelPreProcessing = React.useCallback((initialValue, value) => {
    if (value === GridPreferencePanelsValue.columns) {
      var _props$componentsProp;

      const ColumnsPanel = props.components.ColumnsPanel;
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

  const prevInnerWidth = React.useRef(null);

  const handleGridSizeChange = viewportInnerSize => {
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

  const hydrateColumns = React.useCallback(() => {
    logger.info(`Columns pipe processing have changed, regenerating the columns`);
    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
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

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    logger.info(`GridColumns have changed, new length ${props.columns.length}`);

    if (previousColumnsProp.current === props.columns && previousColumnTypesProp.current === columnTypes) {
      return;
    }

    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
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
  React.useEffect(() => {
    if (props.columnVisibilityModel !== undefined) {
      apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
    }
  }, [apiRef, logger, props.columnVisibilityModel]);
}