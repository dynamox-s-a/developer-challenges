import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { debounce, capitalize } from '@mui/material/utils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridDensityRowHeightSelector, gridDensityFactorSelector } from '../density/densitySelector';
import { gridFilterStateSelector } from '../filter/gridFilterSelector';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridSortingStateSelector } from '../sorting/gridSortingSelector';
import { useGridRegisterPipeApplier } from '../../core/pipeProcessing';
import { gridPinnedRowsSelector } from './gridRowsSelector';
export var rowsMetaStateInitializer = function rowsMetaStateInitializer(state) {
  return _extends({}, state, {
    rowsMeta: {
      currentPageTotalHeight: 0,
      positions: []
    }
  });
};
/**
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */

export var useGridRowsMeta = function useGridRowsMeta(apiRef, props) {
  var getRowHeightProp = props.getRowHeight,
      getRowSpacing = props.getRowSpacing,
      getEstimatedRowHeight = props.getEstimatedRowHeight;
  var rowsHeightLookup = React.useRef({}); // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js

  var lastMeasuredRowIndex = React.useRef(-1);
  var hasRowWithAutoHeight = React.useRef(false);
  var rowHeightFromDensity = useGridSelector(apiRef, gridDensityRowHeightSelector);
  var filterState = useGridSelector(apiRef, gridFilterStateSelector);
  var paginationState = useGridSelector(apiRef, gridPaginationSelector);
  var sortingState = useGridSelector(apiRef, gridSortingStateSelector);
  var currentPage = useGridVisibleRows(apiRef, props);
  var pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  var hydrateRowsMeta = React.useCallback(function () {
    var _pinnedRows$top, _pinnedRows$bottom;

    hasRowWithAutoHeight.current = false;
    var densityFactor = gridDensityFactorSelector(apiRef.current.state, apiRef.current.instanceId);

    var calculateRowProcessedSizes = function calculateRowProcessedSizes(row) {
      if (!rowsHeightLookup.current[row.id]) {
        rowsHeightLookup.current[row.id] = {
          sizes: {
            baseCenter: rowHeightFromDensity
          },
          isResized: false,
          autoHeight: false,
          needsFirstMeasurement: true // Assume all rows will need to be measured by default

        };
      }

      var _rowsHeightLookup$cur = rowsHeightLookup.current[row.id],
          isResized = _rowsHeightLookup$cur.isResized,
          needsFirstMeasurement = _rowsHeightLookup$cur.needsFirstMeasurement,
          sizes = _rowsHeightLookup$cur.sizes;
      var baseRowHeight = rowHeightFromDensity;
      var existingBaseRowHeight = sizes.baseCenter;

      if (isResized) {
        // Do not recalculate resized row height and use the value from the lookup
        baseRowHeight = existingBaseRowHeight;
      } else if (getRowHeightProp) {
        var rowHeightFromUser = getRowHeightProp(_extends({}, row, {
          densityFactor: densityFactor
        }));

        if (rowHeightFromUser === 'auto') {
          if (needsFirstMeasurement) {
            var estimatedRowHeight = getEstimatedRowHeight ? getEstimatedRowHeight(_extends({}, row, {
              densityFactor: densityFactor
            })) : rowHeightFromDensity; // If the row was not measured yet use the estimated row height

            baseRowHeight = estimatedRowHeight != null ? estimatedRowHeight : rowHeightFromDensity;
          } else {
            baseRowHeight = existingBaseRowHeight;
          }

          hasRowWithAutoHeight.current = true;
          rowsHeightLookup.current[row.id].autoHeight = true;
        } else {
          // Default back to base rowHeight if getRowHeight returns null or undefined.
          baseRowHeight = rowHeightFromUser != null ? rowHeightFromUser : rowHeightFromDensity;
          rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
          rowsHeightLookup.current[row.id].autoHeight = false;
        }
      } else {
        rowsHeightLookup.current[row.id].needsFirstMeasurement = false;
      }

      var existingBaseSizes = Object.entries(sizes).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            size = _ref2[1];

        if (/^base[A-Z]/.test(key)) {
          acc[key] = size;
        }

        return acc;
      }, {}); // We use an object to make simple to check if a height is already added or not

      var initialHeights = _extends({}, existingBaseSizes, {
        baseCenter: baseRowHeight
      });

      if (getRowSpacing) {
        var _spacing$top, _spacing$bottom;

        var indexRelativeToCurrentPage = apiRef.current.getRowIndexRelativeToVisibleRows(row.id);
        var spacing = getRowSpacing(_extends({}, row, {
          isFirstVisible: indexRelativeToCurrentPage === 0,
          isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
          indexRelativeToCurrentPage: indexRelativeToCurrentPage
        }));
        initialHeights.spacingTop = (_spacing$top = spacing.top) != null ? _spacing$top : 0;
        initialHeights.spacingBottom = (_spacing$bottom = spacing.bottom) != null ? _spacing$bottom : 0;
      }

      var processedSizes = apiRef.current.unstable_applyPipeProcessors('rowHeight', initialHeights, row);
      rowsHeightLookup.current[row.id].sizes = processedSizes;
      return processedSizes;
    };

    var positions = [];
    var currentPageTotalHeight = currentPage.rows.reduce(function (acc, row) {
      positions.push(acc);
      var maximumBaseSize = 0;
      var otherSizes = 0;
      var processedSizes = calculateRowProcessedSizes(row);
      Object.entries(processedSizes).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            size = _ref4[0],
            value = _ref4[1];

        if (/^base[A-Z]/.test(size)) {
          maximumBaseSize = value > maximumBaseSize ? value : maximumBaseSize;
        } else {
          otherSizes += value;
        }
      });
      return acc + maximumBaseSize + otherSizes;
    }, 0);
    pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.forEach(function (row) {
      calculateRowProcessedSizes(row);
    });
    pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.forEach(function (row) {
      calculateRowProcessedSizes(row);
    });
    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        rowsMeta: {
          currentPageTotalHeight: currentPageTotalHeight,
          positions: positions
        }
      });
    });

    if (!hasRowWithAutoHeight.current) {
      // No row has height=auto, so all rows are already measured
      lastMeasuredRowIndex.current = Infinity;
    }

    apiRef.current.forceUpdate();
  }, [apiRef, currentPage.rows, rowHeightFromDensity, getRowHeightProp, getRowSpacing, getEstimatedRowHeight, pinnedRows]);
  var getRowHeight = React.useCallback(function (rowId) {
    var height = rowsHeightLookup.current[rowId];
    return height ? height.sizes.baseCenter : rowHeightFromDensity;
  }, [rowHeightFromDensity]);

  var getRowInternalSizes = function getRowInternalSizes(rowId) {
    var _rowsHeightLookup$cur2;

    return (_rowsHeightLookup$cur2 = rowsHeightLookup.current[rowId]) == null ? void 0 : _rowsHeightLookup$cur2.sizes;
  };

  var setRowHeight = React.useCallback(function (id, height) {
    rowsHeightLookup.current[id].sizes.baseCenter = height;
    rowsHeightLookup.current[id].isResized = true;
    rowsHeightLookup.current[id].needsFirstMeasurement = false;
    hydrateRowsMeta();
  }, [hydrateRowsMeta]);
  var debouncedHydrateRowsMeta = React.useMemo(function () {
    return debounce(hydrateRowsMeta);
  }, [hydrateRowsMeta]);
  var storeMeasuredRowHeight = React.useCallback(function (id, height, position) {
    if (!rowsHeightLookup.current[id] || !rowsHeightLookup.current[id].autoHeight) {
      return;
    } // Only trigger hydration if the value is different, otherwise we trigger a loop


    var needsHydration = rowsHeightLookup.current[id].sizes["base".concat(capitalize(position))] !== height;
    rowsHeightLookup.current[id].needsFirstMeasurement = false;
    rowsHeightLookup.current[id].sizes["base".concat(capitalize(position))] = height;

    if (needsHydration) {
      debouncedHydrateRowsMeta();
    }
  }, [debouncedHydrateRowsMeta]);
  var rowHasAutoHeight = React.useCallback(function (id) {
    var _rowsHeightLookup$cur3;

    return ((_rowsHeightLookup$cur3 = rowsHeightLookup.current[id]) == null ? void 0 : _rowsHeightLookup$cur3.autoHeight) || false;
  }, []);
  var getLastMeasuredRowIndex = React.useCallback(function () {
    return lastMeasuredRowIndex.current;
  }, []);
  var setLastMeasuredRowIndex = React.useCallback(function (index) {
    if (hasRowWithAutoHeight.current && index > lastMeasuredRowIndex.current) {
      lastMeasuredRowIndex.current = index;
    }
  }, []);
  var resetRowHeights = React.useCallback(function () {
    rowsHeightLookup.current = {};
    hydrateRowsMeta();
  }, [hydrateRowsMeta]); // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
  // Because of variable row height this is needed for the virtualization

  React.useEffect(function () {
    hydrateRowsMeta();
  }, [rowHeightFromDensity, filterState, paginationState, sortingState, hydrateRowsMeta]);
  useGridRegisterPipeApplier(apiRef, 'rowHeight', hydrateRowsMeta);
  var rowsMetaApi = {
    unstable_getLastMeasuredRowIndex: getLastMeasuredRowIndex,
    unstable_setLastMeasuredRowIndex: setLastMeasuredRowIndex,
    unstable_rowHasAutoHeight: rowHasAutoHeight,
    unstable_getRowHeight: getRowHeight,
    unstable_getRowInternalSizes: getRowInternalSizes,
    unstable_setRowHeight: setRowHeight,
    unstable_storeRowHeightMeasurement: storeMeasuredRowHeight,
    resetRowHeights: resetRowHeights
  };
  useGridApiMethod(apiRef, rowsMetaApi, 'GridRowsMetaApi');
};