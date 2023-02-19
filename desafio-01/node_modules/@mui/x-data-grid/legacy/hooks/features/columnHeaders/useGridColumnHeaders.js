import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useForkRef } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridVisibleColumnDefinitionsSelector, gridColumnPositionsSelector } from '../columns/gridColumnsSelector';
import { gridTabIndexColumnHeaderSelector, gridTabIndexCellSelector, gridFocusColumnHeaderSelector } from '../focus/gridFocusStateSelector';
import { gridDensityHeaderHeightSelector, gridDensityHeaderGroupingMaxDepthSelector, gridDensityTotalHeaderHeightSelector } from '../density/densitySelector';
import { gridFilterActiveItemsLookupSelector } from '../filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../sorting/gridSortingSelector';
import { gridColumnMenuSelector } from '../columnMenu/columnMenuSelector';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { getFirstColumnIndexToRender } from '../columns/gridColumnsUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { getRenderableIndexes } from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { isDeepEqual } from '../../../utils/utils'; // TODO: add the possibility to switch this value if needed for customization

import { jsx as _jsx } from "react/jsx-runtime";
var MERGE_EMPTY_CELLS = true;
var GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.columnHeaderRow;
  }
})(function () {
  return {
    display: 'flex'
  };
});

function isUIEvent(event) {
  return !!event.target;
}

export var useGridColumnHeaders = function useGridColumnHeaders(props) {
  var innerRefProp = props.innerRef,
      _props$minColumnIndex = props.minColumnIndex,
      minColumnIndex = _props$minColumnIndex === void 0 ? 0 : _props$minColumnIndex;

  var _React$useState = React.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      dragCol = _React$useState2[0],
      setDragCol = _React$useState2[1];

  var _React$useState3 = React.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      resizeCol = _React$useState4[0],
      setResizeCol = _React$useState4[1];

  var apiRef = useGridApiContext();
  var visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  var columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  var tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  var cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  var columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  var headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  var headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  var totalHeaderHeight = useGridSelector(apiRef, gridDensityTotalHeaderHeightSelector);
  var filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  var sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  var columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  var rootProps = useGridRootProps();
  var innerRef = React.useRef(null);
  var handleInnerRef = useForkRef(innerRefProp, innerRef);

  var _React$useState5 = React.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      renderContext = _React$useState6[0],
      setRenderContext = _React$useState6[1];

  var prevRenderContext = React.useRef(renderContext);
  var prevScrollLeft = React.useRef(0);
  var currentPage = useGridVisibleRows(apiRef, rootProps);
  React.useEffect(function () {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]); // memoize `getFirstColumnIndexToRender`, since it's called on scroll

  var getFirstColumnIndexToRenderRef = React.useRef(defaultMemoize(getFirstColumnIndexToRender, {
    equalityCheck: function equalityCheck(a, b) {
      return ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(function (key) {
        return a[key] === b[key];
      });
    }
  }));
  var updateInnerPosition = React.useCallback(function (nextRenderContext) {
    var _getRenderableIndexes = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    }),
        _getRenderableIndexes2 = _slicedToArray(_getRenderableIndexes, 2),
        firstRowToRender = _getRenderableIndexes2[0],
        lastRowToRender = _getRenderableIndexes2[1];

    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minColumnIndex,
      columnBuffer: rootProps.columnBuffer,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      apiRef: apiRef,
      visibleRows: currentPage.rows
    });
    var offset = firstColumnToRender > 0 ? prevScrollLeft.current - columnPositions[firstColumnToRender] : prevScrollLeft.current;
    innerRef.current.style.transform = "translate3d(".concat(-offset, "px, 0px, 0px)");
  }, [columnPositions, minColumnIndex, rootProps.columnBuffer, apiRef, currentPage.rows, rootProps.rowBuffer]);
  React.useLayoutEffect(function () {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);
  var handleScroll = React.useCallback(function (_ref, event) {
    var _prevRenderContext$cu, _prevRenderContext$cu2;

    var left = _ref.left,
        _ref$renderContext = _ref.renderContext,
        nextRenderContext = _ref$renderContext === void 0 ? null : _ref$renderContext;

    if (!innerRef.current) {
      return;
    } // Ignore vertical scroll.
    // Excepts the first event which sets the previous render context.


    if (prevScrollLeft.current === left && ((_prevRenderContext$cu = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu.firstColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.firstColumnIndex) && ((_prevRenderContext$cu2 = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu2.lastColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.lastColumnIndex)) {
      return;
    }

    prevScrollLeft.current = left; // We can only update the position when we guarantee that the render context has been
    // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.

    var canUpdateInnerPosition = false;

    if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
      // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
      if (isUIEvent(event)) {
        // To prevent flickering, the inner position can only be updated after the new context has
        // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
        // updating the position.
        ReactDOM.flushSync(function () {
          setRenderContext(nextRenderContext);
        });
        canUpdateInnerPosition = true;
      } else {
        setRenderContext(nextRenderContext);
      }

      prevRenderContext.current = nextRenderContext;
    } else {
      canUpdateInnerPosition = true;
    } // Pass directly the render context to avoid waiting for the next render


    if (nextRenderContext && canUpdateInnerPosition) {
      updateInnerPosition(nextRenderContext);
    }
  }, [updateInnerPosition]);
  var handleColumnResizeStart = React.useCallback(function (params) {
    return setResizeCol(params.field);
  }, []);
  var handleColumnResizeStop = React.useCallback(function () {
    return setResizeCol('');
  }, []);
  var handleColumnReorderStart = React.useCallback(function (params) {
    return setDragCol(params.field);
  }, []);
  var handleColumnReorderStop = React.useCallback(function () {
    return setDragCol('');
  }, []);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);
  useGridApiEventHandler(apiRef, 'rowsScroll', handleScroll); // Helper for computation common between getColumnHeaders and getColumnGroupHeaders

  var getColumnsToRender = function getColumnsToRender(params) {
    var _ref2 = params || {},
        _ref2$renderContext = _ref2.renderContext,
        nextRenderContext = _ref2$renderContext === void 0 ? renderContext : _ref2$renderContext,
        _ref2$minFirstColumn = _ref2.minFirstColumn,
        minFirstColumn = _ref2$minFirstColumn === void 0 ? minColumnIndex : _ref2$minFirstColumn,
        _ref2$maxLastColumn = _ref2.maxLastColumn,
        maxLastColumn = _ref2$maxLastColumn === void 0 ? visibleColumns.length : _ref2$maxLastColumn;

    if (!nextRenderContext) {
      return null;
    }

    var _getRenderableIndexes3 = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    }),
        _getRenderableIndexes4 = _slicedToArray(_getRenderableIndexes3, 2),
        firstRowToRender = _getRenderableIndexes4[0],
        lastRowToRender = _getRenderableIndexes4[1];

    var firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef: apiRef,
      firstRowToRender: firstRowToRender,
      lastRowToRender: lastRowToRender,
      visibleRows: currentPage.rows
    });
    var lastColumnToRender = Math.min(nextRenderContext.lastColumnIndex + rootProps.columnBuffer, maxLastColumn);
    var renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    return {
      renderedColumns: renderedColumns,
      firstColumnToRender: firstColumnToRender,
      lastColumnToRender: lastColumnToRender,
      minFirstColumn: minFirstColumn,
      maxLastColumn: maxLastColumn
    };
  };

  var getColumnHeaders = function getColumnHeaders(params) {
    var other = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null) {
      return null;
    }

    var renderedColumns = columnsToRender.renderedColumns,
        firstColumnToRender = columnsToRender.firstColumnToRender;
    var columns = [];

    for (var i = 0; i < renderedColumns.length; i += 1) {
      var column = renderedColumns[i];
      var columnIndex = firstColumnToRender + i;
      var isFirstColumn = columnIndex === 0;
      var hasTabbableElement = !(tabIndexState === null && cellTabIndexState === null);
      var tabIndex = tabIndexState !== null && tabIndexState.field === column.field || isFirstColumn && !hasTabbableElement ? 0 : -1;
      var hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === column.field;
      var open = columnMenuState.open && columnMenuState.field === column.field;
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderItem, _extends({}, sortColumnLookup[column.field], {
        columnMenuOpen: open,
        filterItemsCounter: filterColumnLookup[column.field] && filterColumnLookup[column.field].length,
        headerHeight: headerHeight,
        isDragging: column.field === dragCol,
        column: column,
        colIndex: columnIndex,
        isResizing: resizeCol === column.field,
        isLastColumn: columnIndex === visibleColumns.length - 1,
        extendRowFullWidth: !rootProps.disableExtendRowFullWidth,
        hasFocus: hasFocus,
        tabIndex: tabIndex
      }, other), column.field));
    }

    return /*#__PURE__*/_jsx(GridColumnHeaderRow, {
      role: "row",
      "aria-rowindex": headerGroupingMaxDepth + 1,
      children: columns
    });
  };

  var getParents = function getParents() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var depth = arguments.length > 1 ? arguments[1] : undefined;
    return path.slice(0, depth + 1);
  };

  var getColumnGroupHeaders = function getColumnGroupHeaders(params) {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }

    var columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null || columnsToRender.renderedColumns.length === 0) {
      return null;
    }

    var renderedColumns = columnsToRender.renderedColumns,
        firstColumnToRender = columnsToRender.firstColumnToRender,
        lastColumnToRender = columnsToRender.lastColumnToRender,
        maxLastColumn = columnsToRender.maxLastColumn;
    var columns = [];
    var headerToRender = [];

    var _loop = function _loop(depth) {
      var _visibleColumns$first, _visibleColumns$first2, _visibleColumns$first3;

      // Initialize the header line with a grouping item containing all the columns on the left of the virtualization which are in the same group as the first group to render
      var initialHeader = [];
      var leftOverflow = 0;
      var columnIndex = firstColumnToRender - 1;
      var firstColumnToRenderGroup = (_visibleColumns$first = visibleColumns[firstColumnToRender]) == null ? void 0 : (_visibleColumns$first2 = _visibleColumns$first.groupPath) == null ? void 0 : _visibleColumns$first2[depth]; // The array of parent is used to manage empty grouping cell
      // When two empty grouping cell are next to each other, we merge them if the belong to the same group.

      var firstColumnToRenderGroupParents = getParents((_visibleColumns$first3 = visibleColumns[firstColumnToRender]) == null ? void 0 : _visibleColumns$first3.groupPath, depth);

      while (firstColumnToRenderGroup !== null && columnIndex >= minColumnIndex && (_visibleColumns$colum = visibleColumns[columnIndex]) != null && _visibleColumns$colum.groupPath && isDeepEqual(getParents((_visibleColumns$colum2 = visibleColumns[columnIndex]) == null ? void 0 : _visibleColumns$colum2.groupPath, depth), firstColumnToRenderGroupParents)) {
        var _visibleColumns$colum, _visibleColumns$colum2, _column$computedWidth;

        var column = visibleColumns[columnIndex];
        leftOverflow += (_column$computedWidth = column.computedWidth) != null ? _column$computedWidth : 0;

        if (initialHeader.length === 0) {
          var _column$computedWidth2;

          initialHeader.push({
            width: (_column$computedWidth2 = column.computedWidth) != null ? _column$computedWidth2 : 0,
            fields: [column.field],
            groupId: firstColumnToRenderGroup,
            groupParents: firstColumnToRenderGroupParents,
            colIndex: columnIndex
          });
        } else {
          var _column$computedWidth3;

          initialHeader[0].width += (_column$computedWidth3 = column.computedWidth) != null ? _column$computedWidth3 : 0;
          initialHeader[0].fields.push(column.field);
          initialHeader[0].colIndex = columnIndex;
        }

        columnIndex -= 1;
      }

      var depthInfo = renderedColumns.reduce(function (aggregated, column, i) {
        var _column$computedWidth7;

        var lastItem = aggregated[aggregated.length - 1];

        if (column.groupPath && column.groupPath.length > depth) {
          var _column$computedWidth5;

          if (lastItem && lastItem.groupId === column.groupPath[depth]) {
            var _column$computedWidth4;

            // Merge with the previous columns
            return [].concat(_toConsumableArray(aggregated.slice(0, aggregated.length - 1)), [_extends({}, lastItem, {
              width: lastItem.width + ((_column$computedWidth4 = column.computedWidth) != null ? _column$computedWidth4 : 0),
              fields: [].concat(_toConsumableArray(lastItem.fields), [column.field])
            })]);
          } // Create a new grouping


          return [].concat(_toConsumableArray(aggregated), [{
            groupId: column.groupPath[depth],
            groupParents: getParents(column.groupPath, depth),
            width: (_column$computedWidth5 = column.computedWidth) != null ? _column$computedWidth5 : 0,
            fields: [column.field],
            colIndex: firstColumnToRender + i
          }]);
        }

        if (MERGE_EMPTY_CELLS && lastItem && lastItem.groupId === null && isDeepEqual(getParents(column.groupPath, depth), lastItem.groupParents)) {
          var _column$computedWidth6;

          // We merge with previous column
          return [].concat(_toConsumableArray(aggregated.slice(0, aggregated.length - 1)), [_extends({}, lastItem, {
            width: lastItem.width + ((_column$computedWidth6 = column.computedWidth) != null ? _column$computedWidth6 : 0),
            fields: [].concat(_toConsumableArray(lastItem.fields), [column.field])
          })]);
        } // We create new empty cell


        return [].concat(_toConsumableArray(aggregated), [{
          groupId: null,
          groupParents: getParents(column.groupPath, depth),
          width: (_column$computedWidth7 = column.computedWidth) != null ? _column$computedWidth7 : 0,
          fields: [column.field],
          colIndex: firstColumnToRender + i
        }]);
      }, initialHeader);
      columnIndex = lastColumnToRender;
      var lastColumnToRenderGroup = depthInfo[depthInfo.length - 1].groupId;

      while (lastColumnToRenderGroup !== null && columnIndex < maxLastColumn && (_visibleColumns$colum3 = visibleColumns[columnIndex]) != null && _visibleColumns$colum3.groupPath && ((_visibleColumns$colum4 = visibleColumns[columnIndex]) == null ? void 0 : (_visibleColumns$colum5 = _visibleColumns$colum4.groupPath) == null ? void 0 : _visibleColumns$colum5[depth]) === lastColumnToRenderGroup) {
        var _visibleColumns$colum3, _visibleColumns$colum4, _visibleColumns$colum5, _column$computedWidth8;

        var _column = visibleColumns[columnIndex];
        depthInfo[depthInfo.length - 1].width += (_column$computedWidth8 = _column.computedWidth) != null ? _column$computedWidth8 : 0;
        depthInfo[depthInfo.length - 1].fields.push(_column.field);
        columnIndex += 1;
      }

      headerToRender.push({
        leftOverflow: leftOverflow,
        elements: _toConsumableArray(depthInfo)
      });
    };

    for (var depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      _loop(depth);
    }

    headerToRender.forEach(function (depthInfo, depthIndex) {
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderRow, {
        style: {
          height: "".concat(headerHeight, "px"),
          transform: "translateX(-".concat(depthInfo.leftOverflow, "px)")
        },
        role: "row",
        "aria-rowindex": depthIndex + 1,
        children: depthInfo.elements.map(function (_ref3, groupIndex) {
          var groupId = _ref3.groupId,
              width = _ref3.width,
              fields = _ref3.fields,
              colIndex = _ref3.colIndex;
          return /*#__PURE__*/_jsx(GridColumnGroupHeader, {
            groupId: groupId,
            width: width,
            fields: fields,
            colIndex: colIndex,
            depth: depthIndex,
            isLastColumn: colIndex === visibleColumns.length - fields.length,
            extendRowFullWidth: !rootProps.disableExtendRowFullWidth,
            maxDepth: headerToRender.length,
            height: headerHeight
          }, groupIndex);
        })
      }, depthIndex));
    });
    return columns;
  };

  var rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: "".concat(headerHeight, "px")
  };
  return {
    renderContext: renderContext,
    getColumnHeaders: getColumnHeaders,
    getColumnGroupHeaders: getColumnGroupHeaders,
    isDragging: !!dragCol,
    getRootProps: function getRootProps() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _extends({
        style: rootStyle
      }, other);
    },
    getInnerProps: function getInnerProps() {
      return {
        ref: handleInnerRef,
        role: 'rowgroup'
      };
    }
  };
};