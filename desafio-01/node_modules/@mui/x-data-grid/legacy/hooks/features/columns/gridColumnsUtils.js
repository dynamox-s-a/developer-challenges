import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import { DEFAULT_GRID_COL_TYPE_KEY, getGridDefaultColumnTypes } from '../../../colDef';
import { gridColumnsSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';
import { clamp } from '../../../utils/utils';
export var COLUMNS_DIMENSION_PROPERTIES = ['maxWidth', 'minWidth', 'width', 'flex'];
export var computeColumnTypes = function computeColumnTypes() {
  var customColumnTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var mergedColumnTypes = _extends({}, getGridDefaultColumnTypes());

  Object.entries(customColumnTypes).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        colType = _ref2[0],
        colTypeDef = _ref2[1];

    if (mergedColumnTypes[colType]) {
      mergedColumnTypes[colType] = _extends({}, mergedColumnTypes[colType], colTypeDef);
    } else {
      mergedColumnTypes[colType] = _extends({}, mergedColumnTypes[colTypeDef.extendType || DEFAULT_GRID_COL_TYPE_KEY], colTypeDef);
    }
  });
  return mergedColumnTypes;
};
/**
 * Computes width for flex columns.
 * Based on CSS Flexbox specification:
 * https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
 */

export function computeFlexColumnsWidth(_ref3) {
  var initialFreeSpace = _ref3.initialFreeSpace,
      totalFlexUnits = _ref3.totalFlexUnits,
      flexColumns = _ref3.flexColumns;
  var flexColumnsLookup = {
    all: {},
    frozenFields: [],
    freeze: function freeze(field) {
      var value = flexColumnsLookup.all[field];

      if (value && value.frozen !== true) {
        flexColumnsLookup.all[field].frozen = true;
        flexColumnsLookup.frozenFields.push(field);
      }
    }
  }; // Step 5 of https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths

  function loopOverFlexItems() {
    // 5a: If all the flex items on the line are frozen, free space has been distributed.
    if (flexColumnsLookup.frozenFields.length === flexColumns.length) {
      return;
    }

    var violationsLookup = {
      min: {},
      max: {}
    };
    var remainingFreeSpace = initialFreeSpace;
    var flexUnits = totalFlexUnits;
    var totalViolation = 0; // 5b: Calculate the remaining free space

    flexColumnsLookup.frozenFields.forEach(function (field) {
      remainingFreeSpace -= flexColumnsLookup.all[field].computedWidth;
      flexUnits -= flexColumnsLookup.all[field].flex;
    });

    for (var i = 0; i < flexColumns.length; i += 1) {
      var column = flexColumns[i];

      if (flexColumnsLookup.all[column.field] && flexColumnsLookup.all[column.field].frozen === true) {
        // eslint-disable-next-line no-continue
        continue;
      } // 5c: Distribute remaining free space proportional to the flex factors


      var widthPerFlexUnit = remainingFreeSpace / flexUnits;
      var computedWidth = widthPerFlexUnit * column.flex; // 5d: Fix min/max violations

      if (computedWidth < column.minWidth) {
        totalViolation += column.minWidth - computedWidth;
        computedWidth = column.minWidth;
        violationsLookup.min[column.field] = true;
      } else if (computedWidth > column.maxWidth) {
        totalViolation += column.maxWidth - computedWidth;
        computedWidth = column.maxWidth;
        violationsLookup.max[column.field] = true;
      }

      flexColumnsLookup.all[column.field] = {
        frozen: false,
        computedWidth: computedWidth,
        flex: column.flex
      };
    } // 5e: Freeze over-flexed items


    if (totalViolation < 0) {
      // Freeze all the items with max violations
      Object.keys(violationsLookup.max).forEach(function (field) {
        flexColumnsLookup.freeze(field);
      });
    } else if (totalViolation > 0) {
      // Freeze all the items with min violations
      Object.keys(violationsLookup.min).forEach(function (field) {
        flexColumnsLookup.freeze(field);
      });
    } else {
      // Freeze all items
      flexColumns.forEach(function (_ref4) {
        var field = _ref4.field;
        flexColumnsLookup.freeze(field);
      });
    } // 5f: Return to the start of this loop


    loopOverFlexItems();
  }

  loopOverFlexItems();
  return flexColumnsLookup.all;
}
/**
 * Compute the `computedWidth` (ie: the width the column should have during rendering) based on the `width` / `flex` / `minWidth` / `maxWidth` properties of `GridColDef`.
 * The columns already have been merged with there `type` default values for `minWidth`, `maxWidth` and `width`, thus the `!` for those properties below.
 * TODO: Unit test this function in depth and only keep basic cases for the whole grid testing.
 * TODO: Improve the `GridColDef` typing to reflect the fact that `minWidth` / `maxWidth` and `width` can't be null after the merge with the `type` default values.
 */

export var hydrateColumnsWidth = function hydrateColumnsWidth(rawState, viewportInnerWidth) {
  var columnsLookup = {};
  var totalFlexUnits = 0;
  var widthAllocatedBeforeFlex = 0;
  var flexColumns = []; // For the non-flex columns, compute their width
  // For the flex columns, compute there minimum width and how much width must be allocated during the flex allocation

  rawState.all.forEach(function (columnField) {
    var newColumn = _extends({}, rawState.lookup[columnField]);

    if (rawState.columnVisibilityModel[columnField] === false) {
      newColumn.computedWidth = 0;
    } else {
      var computedWidth;

      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        computedWidth = 0;
        flexColumns.push(newColumn);
      } else {
        computedWidth = clamp(newColumn.width, newColumn.minWidth, newColumn.maxWidth);
      }

      widthAllocatedBeforeFlex += computedWidth;
      newColumn.computedWidth = computedWidth;
    }

    columnsLookup[columnField] = newColumn;
  });
  var initialFreeSpace = Math.max(viewportInnerWidth - widthAllocatedBeforeFlex, 0); // Allocate the remaining space to the flex columns

  if (totalFlexUnits > 0 && viewportInnerWidth > 0) {
    var computedColumnWidths = computeFlexColumnsWidth({
      initialFreeSpace: initialFreeSpace,
      totalFlexUnits: totalFlexUnits,
      flexColumns: flexColumns
    });
    Object.keys(computedColumnWidths).forEach(function (field) {
      columnsLookup[field].computedWidth = computedColumnWidths[field].computedWidth;
    });
  }

  return _extends({}, rawState, {
    lookup: columnsLookup
  });
};
var columnTypeWarnedOnce = false;
/**
 * Apply the order and the dimensions of the initial state.
 * The columns not registered in `orderedFields` will be placed after the imported columns.
 */

export var applyInitialState = function applyInitialState(columnsState, initialState) {
  if (!initialState) {
    return columnsState;
  }

  var _initialState$ordered = initialState.orderedFields,
      orderedFields = _initialState$ordered === void 0 ? [] : _initialState$ordered,
      _initialState$dimensi = initialState.dimensions,
      dimensions = _initialState$dimensi === void 0 ? {} : _initialState$dimensi;
  var columnsWithUpdatedDimensions = Object.keys(dimensions);

  if (columnsWithUpdatedDimensions.length === 0 && orderedFields.length === 0) {
    return columnsState;
  }

  var orderedFieldsLookup = {};
  var cleanOrderedFields = [];

  for (var i = 0; i < orderedFields.length; i += 1) {
    var _field = orderedFields[i]; // Ignores the fields in the initialState that matches no field on the current column state

    if (columnsState.lookup[_field]) {
      orderedFieldsLookup[_field] = true;
      cleanOrderedFields.push(_field);
    }
  }

  var newOrderedFields = cleanOrderedFields.length === 0 ? columnsState.all : [].concat(cleanOrderedFields, _toConsumableArray(columnsState.all.filter(function (field) {
    return !orderedFieldsLookup[field];
  })));

  var newColumnLookup = _extends({}, columnsState.lookup);

  var _loop = function _loop(_i) {
    var field = columnsWithUpdatedDimensions[_i];

    var newColDef = _extends({}, newColumnLookup[field], {
      hasBeenResized: true
    });

    Object.entries(dimensions[field]).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      newColDef[key] = value === -1 ? Infinity : value;
    });
    newColumnLookup[field] = newColDef;
  };

  for (var _i = 0; _i < columnsWithUpdatedDimensions.length; _i += 1) {
    _loop(_i);
  }

  var newColumnsState = {
    all: newOrderedFields,
    lookup: newColumnLookup
  };
  return newColumnsState;
};
/**
 * @deprecated Should have been internal only, you can inline the logic.
 */

export var getGridColDef = function getGridColDef(columnTypes, type) {
  if (!type) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }

  if (process.env.NODE_ENV !== 'production') {
    if (!columnTypeWarnedOnce && !columnTypes[type]) {
      console.warn(["MUI: The column type \"".concat(type, "\" you are using is not supported."), "Column type \"string\" is being used instead."].join('\n'));
      columnTypeWarnedOnce = true;
    }
  }

  if (!columnTypes[type]) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }

  return columnTypes[type];
};
export var createColumnsState = function createColumnsState(_ref7) {
  var _apiRef$current$getRo, _apiRef$current$getRo2, _apiRef$current, _apiRef$current$getRo3;

  var apiRef = _ref7.apiRef,
      columnsToUpsert = _ref7.columnsToUpsert,
      initialState = _ref7.initialState,
      columnTypes = _ref7.columnTypes,
      _ref7$currentColumnVi = _ref7.currentColumnVisibilityModel,
      currentColumnVisibilityModel = _ref7$currentColumnVi === void 0 ? gridColumnVisibilityModelSelector(apiRef) : _ref7$currentColumnVi,
      shouldRegenColumnVisibilityModelFromColumns = _ref7.shouldRegenColumnVisibilityModelFromColumns,
      _ref7$keepOnlyColumns = _ref7.keepOnlyColumnsToUpsert,
      keepOnlyColumnsToUpsert = _ref7$keepOnlyColumns === void 0 ? false : _ref7$keepOnlyColumns;
  var isInsideStateInitializer = !apiRef.current.state.columns;
  var columnsStateWithoutColumnVisibilityModel;

  if (isInsideStateInitializer) {
    columnsStateWithoutColumnVisibilityModel = {
      all: [],
      lookup: {}
    };
  } else {
    var currentState = gridColumnsSelector(apiRef.current.state);
    columnsStateWithoutColumnVisibilityModel = {
      all: keepOnlyColumnsToUpsert ? [] : _toConsumableArray(currentState.all),
      lookup: _extends({}, currentState.lookup) // Will be cleaned later if keepOnlyColumnsToUpsert=true

    };
  }

  var columnsToKeep = {};

  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    columnsToKeep = Object.keys(columnsStateWithoutColumnVisibilityModel.lookup).reduce(function (acc, key) {
      return _extends({}, acc, _defineProperty({}, key, false));
    }, {});
  }

  var columnsToUpsertLookup = {};
  columnsToUpsert.forEach(function (newColumn) {
    var field = newColumn.field;
    columnsToUpsertLookup[field] = true;
    columnsToKeep[field] = true;
    var existingState = columnsStateWithoutColumnVisibilityModel.lookup[field];

    if (existingState == null) {
      // New Column
      existingState = _extends({}, getGridColDef(columnTypes, newColumn.type), {
        // TODO v6: Inline `getGridColDef`
        field: field,
        hasBeenResized: false
      });
      columnsStateWithoutColumnVisibilityModel.all.push(field);
    } else if (keepOnlyColumnsToUpsert) {
      columnsStateWithoutColumnVisibilityModel.all.push(field);
    }

    var hasBeenResized = existingState.hasBeenResized;
    COLUMNS_DIMENSION_PROPERTIES.forEach(function (key) {
      if (newColumn[key] !== undefined) {
        hasBeenResized = true;

        if (newColumn[key] === -1) {
          newColumn[key] = Infinity;
        }
      }
    });
    columnsStateWithoutColumnVisibilityModel.lookup[field] = _extends({}, existingState, {
      hide: newColumn.hide == null ? false : newColumn.hide
    }, newColumn, {
      hasBeenResized: hasBeenResized
    });
  });

  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    Object.keys(columnsStateWithoutColumnVisibilityModel.lookup).forEach(function (field) {
      if (!columnsToKeep[field]) {
        delete columnsStateWithoutColumnVisibilityModel.lookup[field];
      }
    });
  }

  var columnsLookupBeforePreProcessing = _extends({}, columnsStateWithoutColumnVisibilityModel.lookup);

  var columnsStateWithPreProcessing = apiRef.current.unstable_applyPipeProcessors('hydrateColumns', columnsStateWithoutColumnVisibilityModel); // TODO v6: remove the sync between the columns `hide` option and the model.

  var columnVisibilityModel = {};

  if (shouldRegenColumnVisibilityModelFromColumns) {
    var hasModelChanged = false;

    var newColumnVisibilityModel = _extends({}, currentColumnVisibilityModel);

    if (isInsideStateInitializer) {
      columnsStateWithPreProcessing.all.forEach(function (field) {
        newColumnVisibilityModel[field] = !columnsStateWithoutColumnVisibilityModel.lookup[field].hide;
      });
    } else if (keepOnlyColumnsToUpsert) {
      // At this point, `keepOnlyColumnsToUpsert` has a new meaning: keep the columns
      // passed via `columnToUpsert` + columns added by the pre-processors. We do the following
      // cleanup because a given column may have been removed from the `columns` prop but it still
      // exists in the state.
      Object.keys(newColumnVisibilityModel).forEach(function (field) {
        if (!columnsStateWithPreProcessing.lookup[field]) {
          delete newColumnVisibilityModel[field];
          hasModelChanged = true;
        }
      });
    }

    columnsStateWithPreProcessing.all.forEach(function (field) {
      // If neither the `columnsToUpsert` nor the pre-processors updated the column,
      // Then we don't want to update the visibility status of the column in the model.
      if (!columnsToUpsertLookup[field] && columnsLookupBeforePreProcessing[field] === columnsStateWithPreProcessing.lookup[field]) {
        return;
      } // We always assume that a column not in the model is visible by default. However, there's an
      // edge case where the column is not in the model but it also doesn't exist in the `columns`
      // prop, meaning that the column is being added. In that case, we assume that the column was
      // not visible before for it be added to the model.


      var isVisibleBefore = currentColumnVisibilityModel[field];

      if (isVisibleBefore === undefined) {
        if (isInsideStateInitializer) {
          isVisibleBefore = true;
        } else {
          var _currentState = gridColumnsSelector(apiRef.current.state);

          isVisibleBefore = !!_currentState.lookup[field];
        }
      }

      var isVisibleAfter = !columnsStateWithPreProcessing.lookup[field].hide;

      if (isVisibleAfter !== isVisibleBefore) {
        hasModelChanged = true;
        newColumnVisibilityModel[field] = isVisibleAfter;
      }
    });

    if (hasModelChanged || isInsideStateInitializer) {
      columnVisibilityModel = newColumnVisibilityModel;
    } else {
      columnVisibilityModel = currentColumnVisibilityModel;
    }
  } else {
    columnVisibilityModel = currentColumnVisibilityModel;
  }

  var columnsStateWithPortableColumns = applyInitialState(columnsStateWithPreProcessing, initialState);

  var columnsState = _extends({}, columnsStateWithPortableColumns, {
    columnVisibilityModel: columnVisibilityModel
  });

  return hydrateColumnsWidth(columnsState, (_apiRef$current$getRo = (_apiRef$current$getRo2 = (_apiRef$current = apiRef.current).getRootDimensions) == null ? void 0 : (_apiRef$current$getRo3 = _apiRef$current$getRo2.call(_apiRef$current)) == null ? void 0 : _apiRef$current$getRo3.viewportInnerSize.width) != null ? _apiRef$current$getRo : 0);
};
export var mergeColumnsState = function mergeColumnsState(columnsState) {
  return function (state) {
    return _extends({}, state, {
      columns: columnsState
    });
  };
};
export function getFirstNonSpannedColumnToRender(_ref8) {
  var firstColumnToRender = _ref8.firstColumnToRender,
      apiRef = _ref8.apiRef,
      firstRowToRender = _ref8.firstRowToRender,
      lastRowToRender = _ref8.lastRowToRender,
      visibleRows = _ref8.visibleRows;
  var firstNonSpannedColumnToRender = firstColumnToRender;

  for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
    var row = visibleRows[i];

    if (row) {
      var rowId = visibleRows[i].id;
      var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, firstColumnToRender);

      if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
        firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
      }
    }
  }

  return firstNonSpannedColumnToRender;
}
export function getFirstColumnIndexToRender(_ref9) {
  var firstColumnIndex = _ref9.firstColumnIndex,
      minColumnIndex = _ref9.minColumnIndex,
      columnBuffer = _ref9.columnBuffer,
      firstRowToRender = _ref9.firstRowToRender,
      lastRowToRender = _ref9.lastRowToRender,
      apiRef = _ref9.apiRef,
      visibleRows = _ref9.visibleRows;
  var initialFirstColumnToRender = Math.max(firstColumnIndex - columnBuffer, minColumnIndex);
  var firstColumnToRender = getFirstNonSpannedColumnToRender({
    firstColumnToRender: initialFirstColumnToRender,
    apiRef: apiRef,
    firstRowToRender: firstRowToRender,
    lastRowToRender: lastRowToRender,
    visibleRows: visibleRows
  });
  return firstColumnToRender;
}