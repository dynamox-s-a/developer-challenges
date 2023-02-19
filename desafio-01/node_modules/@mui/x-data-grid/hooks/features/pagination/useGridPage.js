import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridLogger, useGridSelector, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { gridVisibleTopLevelRowCountSelector } from '../filter';
import { gridPageSelector, gridPageSizeSelector } from './gridPaginationSelector';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { buildWarning } from '../../../utils/warning';
export const getPageCount = (rowCount, pageSize) => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};

const applyValidPage = paginationState => {
  if (!paginationState.pageCount) {
    return paginationState;
  }

  return _extends({}, paginationState, {
    page: Math.max(Math.min(paginationState.page, paginationState.pageCount - 1), 0)
  });
};

const mergeStateWithPage = page => state => _extends({}, state, {
  pagination: applyValidPage(_extends({}, state.pagination, {
    page
  }))
});

const noRowCountInServerMode = buildWarning(["MUI: the 'rowCount' prop is undefined while using paginationMode='server'", 'For more detail, see http://mui.com/components/data-grid/pagination/#basic-implementation'], 'error');
/**
 * @requires useGridPageSize (event)
 */

export const useGridPage = (apiRef, props) => {
  var _props$initialState2, _props$initialState2$;

  const logger = useGridLogger(apiRef, 'useGridPage');
  const visibleTopLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);
  apiRef.current.unstable_registerControlState({
    stateId: 'page',
    propModel: props.page,
    propOnChange: props.onPageChange,
    stateSelector: gridPageSelector,
    changeEvent: 'pageChange'
  });
  /**
   * API METHODS
   */

  const setPage = React.useCallback(page => {
    logger.debug(`Setting page to ${page}`);
    apiRef.current.setState(mergeStateWithPage(page));
    apiRef.current.forceUpdate();
  }, [apiRef, logger]);
  const pageApi = {
    setPage
  };
  useGridApiMethod(apiRef, pageApi, 'GridPageApi');
  /**
   * PRE-PROCESSING
   */

  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    var _props$initialState, _props$initialState$p;

    const pageToExport = gridPageSelector(apiRef);
    const shouldExportPage = // Always export if the `exportOnlyDirtyModels` property is activated
    !context.exportOnlyDirtyModels || // Always export if the page is controlled
    props.page != null || // Always export if the page has been initialized
    ((_props$initialState = props.initialState) == null ? void 0 : (_props$initialState$p = _props$initialState.pagination) == null ? void 0 : _props$initialState$p.page) != null || // Export if the page is not equal to the default value
    pageToExport !== 0;

    if (!shouldExportPage) {
      return prevState;
    }

    return _extends({}, prevState, {
      pagination: _extends({}, prevState.pagination, {
        page: pageToExport
      })
    });
  }, [apiRef, props.page, (_props$initialState2 = props.initialState) == null ? void 0 : (_props$initialState2$ = _props$initialState2.pagination) == null ? void 0 : _props$initialState2$.page]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    var _context$stateToResto, _context$stateToResto2;

    // We apply the constraint even if the page did not change in case the pageSize changed.
    const page = (_context$stateToResto = (_context$stateToResto2 = context.stateToRestore.pagination) == null ? void 0 : _context$stateToResto2.page) != null ? _context$stateToResto : gridPageSelector(apiRef);
    apiRef.current.setState(mergeStateWithPage(page));
    return params;
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  /**
   * EVENTS
   */

  const handlePageSizeChange = pageSize => {
    apiRef.current.setState(state => {
      const pageCount = getPageCount(state.pagination.rowCount, pageSize);
      return _extends({}, state, {
        pagination: applyValidPage(_extends({}, state.pagination, {
          pageCount,
          page: state.pagination.page
        }))
      });
    });
    apiRef.current.forceUpdate();
  };

  const handlePageChange = () => apiRef.current.scrollToIndexes({
    rowIndex: gridPageSelector(apiRef) * gridPageSizeSelector(apiRef)
  });

  useGridApiEventHandler(apiRef, 'pageSizeChange', handlePageSizeChange);
  useGridApiEventHandler(apiRef, 'pageChange', handlePageChange);
  /**
   * EFFECTS
   */

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (props.paginationMode === 'server' && props.rowCount == null) {
        noRowCountInServerMode();
      }
    }
  }, [props.rowCount, props.paginationMode]);
  React.useEffect(() => {
    apiRef.current.setState(state => {
      const rowCount = props.rowCount !== undefined ? props.rowCount : visibleTopLevelRowCount;
      const pageCount = getPageCount(rowCount, state.pagination.pageSize);
      const page = props.page == null ? state.pagination.page : props.page;
      return _extends({}, state, {
        pagination: applyValidPage(_extends({}, state.pagination, {
          page,
          rowCount,
          pageCount
        }))
      });
    });
    apiRef.current.forceUpdate();
  }, [visibleTopLevelRowCount, props.rowCount, props.page, props.paginationMode, apiRef]);
};