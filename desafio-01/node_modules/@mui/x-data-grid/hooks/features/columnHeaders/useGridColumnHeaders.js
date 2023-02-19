import _extends from "@babel/runtime/helpers/esm/extends";
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
const MERGE_EMPTY_CELLS = true;
const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (props, styles) => styles.columnHeaderRow
})(() => ({
  display: 'flex'
}));

function isUIEvent(event) {
  return !!event.target;
}

export const useGridColumnHeaders = props => {
  const {
    innerRef: innerRefProp,
    minColumnIndex = 0
  } = props;
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');
  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const cellTabIndexState = useGridSelector(apiRef, gridTabIndexCellSelector);
  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  const totalHeaderHeight = useGridSelector(apiRef, gridDensityTotalHeaderHeightSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const rootProps = useGridRootProps();
  const innerRef = React.useRef(null);
  const handleInnerRef = useForkRef(innerRefProp, innerRef);
  const [renderContext, setRenderContext] = React.useState(null);
  const prevRenderContext = React.useRef(renderContext);
  const prevScrollLeft = React.useRef(0);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  React.useEffect(() => {
    apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
  }, [apiRef]); // memoize `getFirstColumnIndexToRender`, since it's called on scroll

  const getFirstColumnIndexToRenderRef = React.useRef(defaultMemoize(getFirstColumnIndexToRender, {
    equalityCheck: (a, b) => ['firstColumnIndex', 'minColumnIndex', 'columnBuffer'].every(key => a[key] === b[key])
  }));
  const updateInnerPosition = React.useCallback(nextRenderContext => {
    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex,
      columnBuffer: rootProps.columnBuffer,
      firstRowToRender,
      lastRowToRender,
      apiRef,
      visibleRows: currentPage.rows
    });
    const offset = firstColumnToRender > 0 ? prevScrollLeft.current - columnPositions[firstColumnToRender] : prevScrollLeft.current;
    innerRef.current.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
  }, [columnPositions, minColumnIndex, rootProps.columnBuffer, apiRef, currentPage.rows, rootProps.rowBuffer]);
  React.useLayoutEffect(() => {
    if (renderContext) {
      updateInnerPosition(renderContext);
    }
  }, [renderContext, updateInnerPosition]);
  const handleScroll = React.useCallback(({
    left,
    renderContext: nextRenderContext = null
  }, event) => {
    var _prevRenderContext$cu, _prevRenderContext$cu2;

    if (!innerRef.current) {
      return;
    } // Ignore vertical scroll.
    // Excepts the first event which sets the previous render context.


    if (prevScrollLeft.current === left && ((_prevRenderContext$cu = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu.firstColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.firstColumnIndex) && ((_prevRenderContext$cu2 = prevRenderContext.current) == null ? void 0 : _prevRenderContext$cu2.lastColumnIndex) === (nextRenderContext == null ? void 0 : nextRenderContext.lastColumnIndex)) {
      return;
    }

    prevScrollLeft.current = left; // We can only update the position when we guarantee that the render context has been
    // rendered. This is achieved using ReactDOM.flushSync or when the context doesn't change.

    let canUpdateInnerPosition = false;

    if (nextRenderContext !== prevRenderContext.current || !prevRenderContext.current) {
      // ReactDOM.flushSync cannot be called on `scroll` events fired inside effects
      if (isUIEvent(event)) {
        // To prevent flickering, the inner position can only be updated after the new context has
        // been rendered. ReactDOM.flushSync ensures that the state changes will happen before
        // updating the position.
        ReactDOM.flushSync(() => {
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
  const handleColumnResizeStart = React.useCallback(params => setResizeCol(params.field), []);
  const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
  const handleColumnReorderStart = React.useCallback(params => setDragCol(params.field), []);
  const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);
  useGridApiEventHandler(apiRef, 'rowsScroll', handleScroll); // Helper for computation common between getColumnHeaders and getColumnGroupHeaders

  const getColumnsToRender = params => {
    const {
      renderContext: nextRenderContext = renderContext,
      minFirstColumn = minColumnIndex,
      maxLastColumn = visibleColumns.length
    } = params || {};

    if (!nextRenderContext) {
      return null;
    }

    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rootProps.rowBuffer
    });
    const firstColumnToRender = getFirstColumnIndexToRenderRef.current({
      firstColumnIndex: nextRenderContext.firstColumnIndex,
      minColumnIndex: minFirstColumn,
      columnBuffer: rootProps.columnBuffer,
      apiRef,
      firstRowToRender,
      lastRowToRender,
      visibleRows: currentPage.rows
    });
    const lastColumnToRender = Math.min(nextRenderContext.lastColumnIndex + rootProps.columnBuffer, maxLastColumn);
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    return {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender,
      minFirstColumn,
      maxLastColumn
    };
  };

  const getColumnHeaders = (params, other = {}) => {
    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null) {
      return null;
    }

    const {
      renderedColumns,
      firstColumnToRender
    } = columnsToRender;
    const columns = [];

    for (let i = 0; i < renderedColumns.length; i += 1) {
      const column = renderedColumns[i];
      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const hasTabbableElement = !(tabIndexState === null && cellTabIndexState === null);
      const tabIndex = tabIndexState !== null && tabIndexState.field === column.field || isFirstColumn && !hasTabbableElement ? 0 : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === column.field;
      const open = columnMenuState.open && columnMenuState.field === column.field;
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

  const getParents = (path = [], depth) => path.slice(0, depth + 1);

  const getColumnGroupHeaders = params => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }

    const columnsToRender = getColumnsToRender(params);

    if (columnsToRender == null || columnsToRender.renderedColumns.length === 0) {
      return null;
    }

    const {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender,
      maxLastColumn
    } = columnsToRender;
    const columns = [];
    const headerToRender = [];

    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      var _visibleColumns$first, _visibleColumns$first2, _visibleColumns$first3;

      // Initialize the header line with a grouping item containing all the columns on the left of the virtualization which are in the same group as the first group to render
      const initialHeader = [];
      let leftOverflow = 0;
      let columnIndex = firstColumnToRender - 1;
      const firstColumnToRenderGroup = (_visibleColumns$first = visibleColumns[firstColumnToRender]) == null ? void 0 : (_visibleColumns$first2 = _visibleColumns$first.groupPath) == null ? void 0 : _visibleColumns$first2[depth]; // The array of parent is used to manage empty grouping cell
      // When two empty grouping cell are next to each other, we merge them if the belong to the same group.

      const firstColumnToRenderGroupParents = getParents((_visibleColumns$first3 = visibleColumns[firstColumnToRender]) == null ? void 0 : _visibleColumns$first3.groupPath, depth);

      while (firstColumnToRenderGroup !== null && columnIndex >= minColumnIndex && (_visibleColumns$colum = visibleColumns[columnIndex]) != null && _visibleColumns$colum.groupPath && isDeepEqual(getParents((_visibleColumns$colum2 = visibleColumns[columnIndex]) == null ? void 0 : _visibleColumns$colum2.groupPath, depth), firstColumnToRenderGroupParents)) {
        var _visibleColumns$colum, _visibleColumns$colum2, _column$computedWidth;

        const column = visibleColumns[columnIndex];
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

      const depthInfo = renderedColumns.reduce((aggregated, column, i) => {
        var _column$computedWidth7;

        const lastItem = aggregated[aggregated.length - 1];

        if (column.groupPath && column.groupPath.length > depth) {
          var _column$computedWidth5;

          if (lastItem && lastItem.groupId === column.groupPath[depth]) {
            var _column$computedWidth4;

            // Merge with the previous columns
            return [...aggregated.slice(0, aggregated.length - 1), _extends({}, lastItem, {
              width: lastItem.width + ((_column$computedWidth4 = column.computedWidth) != null ? _column$computedWidth4 : 0),
              fields: [...lastItem.fields, column.field]
            })];
          } // Create a new grouping


          return [...aggregated, {
            groupId: column.groupPath[depth],
            groupParents: getParents(column.groupPath, depth),
            width: (_column$computedWidth5 = column.computedWidth) != null ? _column$computedWidth5 : 0,
            fields: [column.field],
            colIndex: firstColumnToRender + i
          }];
        }

        if (MERGE_EMPTY_CELLS && lastItem && lastItem.groupId === null && isDeepEqual(getParents(column.groupPath, depth), lastItem.groupParents)) {
          var _column$computedWidth6;

          // We merge with previous column
          return [...aggregated.slice(0, aggregated.length - 1), _extends({}, lastItem, {
            width: lastItem.width + ((_column$computedWidth6 = column.computedWidth) != null ? _column$computedWidth6 : 0),
            fields: [...lastItem.fields, column.field]
          })];
        } // We create new empty cell


        return [...aggregated, {
          groupId: null,
          groupParents: getParents(column.groupPath, depth),
          width: (_column$computedWidth7 = column.computedWidth) != null ? _column$computedWidth7 : 0,
          fields: [column.field],
          colIndex: firstColumnToRender + i
        }];
      }, initialHeader);
      columnIndex = lastColumnToRender;
      const lastColumnToRenderGroup = depthInfo[depthInfo.length - 1].groupId;

      while (lastColumnToRenderGroup !== null && columnIndex < maxLastColumn && (_visibleColumns$colum3 = visibleColumns[columnIndex]) != null && _visibleColumns$colum3.groupPath && ((_visibleColumns$colum4 = visibleColumns[columnIndex]) == null ? void 0 : (_visibleColumns$colum5 = _visibleColumns$colum4.groupPath) == null ? void 0 : _visibleColumns$colum5[depth]) === lastColumnToRenderGroup) {
        var _visibleColumns$colum3, _visibleColumns$colum4, _visibleColumns$colum5, _column$computedWidth8;

        const column = visibleColumns[columnIndex];
        depthInfo[depthInfo.length - 1].width += (_column$computedWidth8 = column.computedWidth) != null ? _column$computedWidth8 : 0;
        depthInfo[depthInfo.length - 1].fields.push(column.field);
        columnIndex += 1;
      }

      headerToRender.push({
        leftOverflow,
        elements: [...depthInfo]
      });
    }

    headerToRender.forEach((depthInfo, depthIndex) => {
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderRow, {
        style: {
          height: `${headerHeight}px`,
          transform: `translateX(-${depthInfo.leftOverflow}px)`
        },
        role: "row",
        "aria-rowindex": depthIndex + 1,
        children: depthInfo.elements.map(({
          groupId,
          width,
          fields,
          colIndex
        }, groupIndex) => {
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

  const rootStyle = {
    minHeight: totalHeaderHeight,
    maxHeight: totalHeaderHeight,
    lineHeight: `${headerHeight}px`
  };
  return {
    renderContext,
    getColumnHeaders,
    getColumnGroupHeaders,
    isDragging: !!dragCol,
    getRootProps: (other = {}) => _extends({
      style: rootStyle
    }, other),
    getInnerProps: () => ({
      ref: handleInnerRef,
      role: 'rowgroup'
    })
  };
};