import * as React from 'react';
import { debounce, ownerDocument, unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnsTotalWidthSelector } from '../columns';
import { gridDensityTotalHeaderHeightSelector, gridDensityRowHeightSelector } from '../density';
import { useGridSelector } from '../../utils';
import { getVisibleRows } from '../../utils/useGridVisibleRows';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { calculatePinnedRowsHeight } from '../rows/gridRowsUtils';
var isTestEnvironment = process.env.NODE_ENV === 'test';

var hasScroll = function hasScroll(_ref) {
  var content = _ref.content,
      container = _ref.container,
      scrollBarSize = _ref.scrollBarSize;
  var hasScrollXIfNoYScrollBar = content.width > container.width;
  var hasScrollYIfNoXScrollBar = content.height > container.height;
  var hasScrollX = false;
  var hasScrollY = false;

  if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
    hasScrollX = hasScrollXIfNoYScrollBar;
    hasScrollY = content.height + (hasScrollX ? scrollBarSize : 0) > container.height; // We recalculate the scroll x to consider the size of the y scrollbar.

    if (hasScrollY) {
      hasScrollX = content.width + scrollBarSize > container.width;
    }
  }

  return {
    hasScrollX: hasScrollX,
    hasScrollY: hasScrollY
  };
};

export function useGridDimensions(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useResizeContainer');
  var errorShown = React.useRef(false);
  var rootDimensionsRef = React.useRef(null);
  var fullDimensionsRef = React.useRef(null);
  var rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  var totalHeaderHeight = useGridSelector(apiRef, gridDensityTotalHeaderHeightSelector);
  var updateGridDimensionsRef = React.useCallback(function () {
    var _apiRef$current$rootE;

    var rootElement = (_apiRef$current$rootE = apiRef.current.rootElementRef) == null ? void 0 : _apiRef$current$rootE.current;
    var columnsTotalWidth = gridColumnsTotalWidthSelector(apiRef);
    var pinnedRowsHeight = calculatePinnedRowsHeight(apiRef);

    if (!rootDimensionsRef.current) {
      return;
    }

    var scrollBarSize;

    if (props.scrollbarSize != null) {
      scrollBarSize = props.scrollbarSize;
    } else if (!columnsTotalWidth || !rootElement) {
      scrollBarSize = 0;
    } else {
      var doc = ownerDocument(rootElement);
      var scrollDiv = doc.createElement('div');
      scrollDiv.style.width = '99px';
      scrollDiv.style.height = '99px';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.className = 'scrollDiv';
      rootElement.appendChild(scrollDiv);
      scrollBarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      rootElement.removeChild(scrollDiv);
    }

    var viewportOuterSize;
    var hasScrollX;
    var hasScrollY;

    if (props.autoHeight) {
      hasScrollY = false;
      hasScrollX = Math.round(columnsTotalWidth) > rootDimensionsRef.current.width;
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rowsMeta.currentPageTotalHeight + (hasScrollX ? scrollBarSize : 0)
      };
    } else {
      viewportOuterSize = {
        width: rootDimensionsRef.current.width,
        height: rootDimensionsRef.current.height - totalHeaderHeight
      };
      var scrollInformation = hasScroll({
        content: {
          width: Math.round(columnsTotalWidth),
          height: rowsMeta.currentPageTotalHeight
        },
        container: {
          width: viewportOuterSize.width,
          height: viewportOuterSize.height - pinnedRowsHeight.top - pinnedRowsHeight.bottom
        },
        scrollBarSize: scrollBarSize
      });
      hasScrollY = scrollInformation.hasScrollY;
      hasScrollX = scrollInformation.hasScrollX;
    }

    var viewportInnerSize = {
      width: viewportOuterSize.width - (hasScrollY ? scrollBarSize : 0),
      height: viewportOuterSize.height - (hasScrollX ? scrollBarSize : 0)
    };
    var newFullDimensions = {
      viewportOuterSize: viewportOuterSize,
      viewportInnerSize: viewportInnerSize,
      hasScrollX: hasScrollX,
      hasScrollY: hasScrollY,
      scrollBarSize: scrollBarSize
    };
    var prevDimensions = fullDimensionsRef.current;
    fullDimensionsRef.current = newFullDimensions;

    if (newFullDimensions.viewportInnerSize.width !== (prevDimensions == null ? void 0 : prevDimensions.viewportInnerSize.width) || newFullDimensions.viewportInnerSize.height !== (prevDimensions == null ? void 0 : prevDimensions.viewportInnerSize.height)) {
      apiRef.current.publishEvent('viewportInnerSizeChange', newFullDimensions.viewportInnerSize);
    }
  }, [apiRef, props.scrollbarSize, props.autoHeight, totalHeaderHeight, rowsMeta.currentPageTotalHeight]);
  var resize = React.useCallback(function () {
    updateGridDimensionsRef();
    apiRef.current.publishEvent('debouncedResize', rootDimensionsRef.current);
  }, [apiRef, updateGridDimensionsRef]);
  var getRootDimensions = React.useCallback(function () {
    return fullDimensionsRef.current;
  }, []);
  var getViewportPageSize = React.useCallback(function () {
    var dimensions = apiRef.current.getRootDimensions();

    if (!dimensions) {
      return 0;
    }

    var currentPage = getVisibleRows(apiRef, {
      pagination: props.pagination,
      paginationMode: props.paginationMode
    }); // TODO: Use a combination of scrollTop, dimensions.viewportInnerSize.height and rowsMeta.possitions
    // to find out the maximum number of rows that can fit in the visible part of the grid

    if (props.getRowHeight) {
      var renderContext = apiRef.current.unstable_getRenderContext();
      var viewportPageSize = renderContext.lastRowIndex - renderContext.firstRowIndex;
      return Math.min(viewportPageSize - 1, currentPage.rows.length);
    }

    var maximumPageSizeWithoutScrollBar = Math.floor(dimensions.viewportInnerSize.height / gridDensityRowHeightSelector(apiRef));
    return Math.min(maximumPageSizeWithoutScrollBar, currentPage.rows.length);
  }, [apiRef, props.pagination, props.paginationMode, props.getRowHeight]);
  var dimensionsApi = {
    resize: resize,
    getRootDimensions: getRootDimensions,
    unstable_getViewportPageSize: getViewportPageSize,
    unstable_updateGridDimensionsRef: updateGridDimensionsRef
  };
  useGridApiMethod(apiRef, dimensionsApi, 'GridDimensionsApi');
  var debounceResize = React.useMemo(function () {
    return debounce(resize, 60);
  }, [resize]);
  var isFirstSizing = React.useRef(true);
  var handleResize = React.useCallback(function (size) {
    rootDimensionsRef.current = size; // jsdom has no layout capabilities

    var isJSDOM = /jsdom/.test(window.navigator.userAgent);

    if (size.height === 0 && !errorShown.current && !props.autoHeight && !isJSDOM) {
      logger.error(['The parent DOM element of the data grid has an empty height.', 'Please make sure that this element has an intrinsic height.', 'The grid displays with a height of 0px.', '', 'More details: https://mui.com/r/x-data-grid-no-dimensions.'].join('\n'));
      errorShown.current = true;
    }

    if (size.width === 0 && !errorShown.current && !isJSDOM) {
      logger.error(['The parent DOM element of the data grid has an empty width.', 'Please make sure that this element has an intrinsic width.', 'The grid displays with a width of 0px.', '', 'More details: https://mui.com/r/x-data-grid-no-dimensions.'].join('\n'));
      errorShown.current = true;
    }

    if (isTestEnvironment) {
      // We don't need to debounce the resize for tests.
      resize();
      isFirstSizing.current = false;
      return;
    }

    if (isFirstSizing.current) {
      // We want to initialize the grid dimensions as soon as possible to avoid flickering
      resize();
      isFirstSizing.current = false;
      return;
    }

    debounceResize();
  }, [props.autoHeight, debounceResize, logger, resize]);
  useEnhancedEffect(function () {
    return updateGridDimensionsRef();
  }, [updateGridDimensionsRef]);
  useGridApiOptionHandler(apiRef, 'sortedRowsSet', updateGridDimensionsRef);
  useGridApiOptionHandler(apiRef, 'pageChange', updateGridDimensionsRef);
  useGridApiOptionHandler(apiRef, 'pageSizeChange', updateGridDimensionsRef);
  useGridApiOptionHandler(apiRef, 'columnsChange', updateGridDimensionsRef);
  useGridApiEventHandler(apiRef, 'resize', handleResize);
  useGridApiOptionHandler(apiRef, 'debouncedResize', props.onResize);
}