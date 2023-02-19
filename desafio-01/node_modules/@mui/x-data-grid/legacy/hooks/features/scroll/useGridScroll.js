import _typeof from "@babel/runtime/helpers/esm/typeof";
import * as React from 'react';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnPositionsSelector, gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridPageSelector, gridPageSizeSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { gridClasses } from '../../../constants/gridClasses'; // Logic copied from https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox.js
// Similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

function scrollIntoView(dimensions) {
  var clientHeight = dimensions.clientHeight,
      scrollTop = dimensions.scrollTop,
      offsetHeight = dimensions.offsetHeight,
      offsetTop = dimensions.offsetTop;
  var elementBottom = offsetTop + offsetHeight; // Always scroll to top when cell is higher than viewport to avoid scroll jump
  // See https://github.com/mui/mui-x/issues/4513 and https://github.com/mui/mui-x/issues/4514

  if (offsetHeight > clientHeight) {
    return offsetTop;
  }

  if (elementBottom - clientHeight > scrollTop) {
    return elementBottom - clientHeight;
  }

  if (offsetTop < scrollTop) {
    return offsetTop;
  }

  return undefined;
}
/**
 * @requires useGridPagination (state) - can be after, async only
 * @requires useGridColumns (state) - can be after, async only
 * @requires useGridRows (state) - can be after, async only
 * @requires useGridRowsMeta (state) - can be after, async only
 * @requires useGridFilter (state)
 * @requires useGridColumnSpanning (method)
 */


export var useGridScroll = function useGridScroll(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridScroll');
  var colRef = apiRef.current.columnHeadersElementRef;
  var windowRef = apiRef.current.windowRef;
  var visibleSortedRows = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  var scrollToIndexes = React.useCallback(function (params) {
    var totalRowCount = gridRowCountSelector(apiRef);
    var visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
    var scrollToHeader = params.rowIndex == null;

    if (!scrollToHeader && totalRowCount === 0 || visibleColumns.length === 0) {
      return false;
    }

    logger.debug("Scrolling to cell at row ".concat(params.rowIndex, ", col: ").concat(params.colIndex, " "));
    var scrollCoordinates = {};

    if (params.colIndex != null) {
      var columnPositions = gridColumnPositionsSelector(apiRef);
      var cellWidth;

      if (typeof params.rowIndex !== 'undefined') {
        var _visibleSortedRows$pa;

        var rowId = (_visibleSortedRows$pa = visibleSortedRows[params.rowIndex]) == null ? void 0 : _visibleSortedRows$pa.id;
        var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, params.colIndex);

        if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
          cellWidth = cellColSpanInfo.cellProps.width;
        }
      }

      if (typeof cellWidth === 'undefined') {
        cellWidth = visibleColumns[params.colIndex].computedWidth;
      }

      scrollCoordinates.left = scrollIntoView({
        clientHeight: windowRef.current.clientWidth,
        scrollTop: windowRef.current.scrollLeft,
        offsetHeight: cellWidth,
        offsetTop: columnPositions[params.colIndex]
      });
    }

    if (params.rowIndex != null) {
      var _querySelector, _querySelector2;

      var rowsMeta = gridRowsMetaSelector(apiRef.current.state);
      var page = gridPageSelector(apiRef);
      var pageSize = gridPageSizeSelector(apiRef);
      var elementIndex = !props.pagination ? params.rowIndex : params.rowIndex - page * pageSize;
      var targetOffsetHeight = rowsMeta.positions[elementIndex + 1] ? rowsMeta.positions[elementIndex + 1] - rowsMeta.positions[elementIndex] : rowsMeta.currentPageTotalHeight - rowsMeta.positions[elementIndex];
      var topPinnedRowsHeight = ((_querySelector = windowRef.current.querySelector(".".concat(gridClasses['pinnedRows--top']))) == null ? void 0 : _querySelector.clientHeight) || 0;
      var bottomPinnedRowsHeight = ((_querySelector2 = windowRef.current.querySelector(".".concat(gridClasses['pinnedRows--bottom']))) == null ? void 0 : _querySelector2.clientHeight) || 0;
      scrollCoordinates.top = scrollIntoView({
        clientHeight: windowRef.current.clientHeight - topPinnedRowsHeight - bottomPinnedRowsHeight,
        scrollTop: windowRef.current.scrollTop,
        offsetHeight: targetOffsetHeight,
        offsetTop: rowsMeta.positions[elementIndex]
      });
    }

    scrollCoordinates = apiRef.current.unstable_applyPipeProcessors('scrollToIndexes', scrollCoordinates, params);

    if (_typeof(scrollCoordinates.left) !== undefined || _typeof(scrollCoordinates.top) !== undefined) {
      apiRef.current.scroll(scrollCoordinates);
      return true;
    }

    return false;
  }, [logger, apiRef, windowRef, props.pagination, visibleSortedRows]);
  var scroll = React.useCallback(function (params) {
    if (windowRef.current && params.left != null && colRef.current) {
      colRef.current.scrollLeft = params.left;
      windowRef.current.scrollLeft = params.left;
      logger.debug("Scrolling left: ".concat(params.left));
    }

    if (windowRef.current && params.top != null) {
      windowRef.current.scrollTop = params.top;
      logger.debug("Scrolling top: ".concat(params.top));
    }

    logger.debug("Scrolling, updating container, and viewport");
  }, [windowRef, colRef, logger]);
  var getScrollPosition = React.useCallback(function () {
    if (!(windowRef != null && windowRef.current)) {
      return {
        top: 0,
        left: 0
      };
    }

    return {
      top: windowRef.current.scrollTop,
      left: windowRef.current.scrollLeft
    };
  }, [windowRef]);
  var scrollApi = {
    scroll: scroll,
    scrollToIndexes: scrollToIndexes,
    getScrollPosition: getScrollPosition
  };
  useGridApiMethod(apiRef, scrollApi, 'GridScrollApi');
};