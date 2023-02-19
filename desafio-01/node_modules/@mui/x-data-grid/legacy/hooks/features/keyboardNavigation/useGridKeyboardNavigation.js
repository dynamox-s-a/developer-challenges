import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as React from 'react';
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { gridVisibleSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef/gridCheckboxSelectionColDef';
import { gridClasses } from '../../../constants/gridClasses';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../constants/gridDetailPanelToggleField';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';

function enrichPageRowsWithPinnedRows(apiRef, rows) {
  var pinnedRows = gridPinnedRowsSelector(apiRef) || {};
  return [].concat(_toConsumableArray(pinnedRows.top || []), _toConsumableArray(rows), _toConsumableArray(pinnedRows.bottom || []));
}
/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */


export var useGridKeyboardNavigation = function useGridKeyboardNavigation(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  var initialCurrentPageRows = useGridVisibleRows(apiRef, props).rows;
  var currentPageRows = React.useMemo(function () {
    return enrichPageRowsWithPinnedRows(apiRef, initialCurrentPageRows);
  }, [apiRef, initialCurrentPageRows]);
  /**
   * @param {number} colIndex Index of the column to focus
   * @param {number} rowIndex index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   * TODO replace with apiRef.current.unstable_moveFocusToRelativeCell()
   */

  var goToCell = React.useCallback(function (colIndex, rowId) {
    var closestColumnToUse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
    var visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef);
    var nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);

    if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
      if (closestColumnToUse === 'left') {
        colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
      } else if (closestColumnToUse === 'right') {
        colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
      }
    } // `scrollToIndexes` requires a rowIndex relative to all visible rows.
    // Those rows do not include pinned rows, but pinned rows do not need scroll anyway.


    var rowIndexRelativeToAllRows = visibleSortedRows.findIndex(function (row) {
      return row.id === rowId;
    });
    logger.debug("Navigating to cell row ".concat(rowIndexRelativeToAllRows, ", col ").concat(colIndex));
    apiRef.current.scrollToIndexes({
      colIndex: colIndex,
      rowIndex: rowIndexRelativeToAllRows
    });
    var field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setCellFocus(rowId, field);
  }, [apiRef, logger]);
  var goToHeader = React.useCallback(function (colIndex, event) {
    logger.debug("Navigating to header col ".concat(colIndex));
    apiRef.current.scrollToIndexes({
      colIndex: colIndex
    });
    var field = apiRef.current.getVisibleColumns()[colIndex].field;
    apiRef.current.setColumnHeaderFocus(field, event);
  }, [apiRef, logger]);
  var getRowIdFromIndex = React.useCallback(function (rowIndex) {
    return currentPageRows[rowIndex].id;
  }, [currentPageRows]);
  var handleCellNavigationKeyDown = React.useCallback(function (params, event) {
    var dimensions = apiRef.current.getRootDimensions();

    if (currentPageRows.length === 0 || !dimensions) {
      return;
    }

    var viewportPageSize = apiRef.current.unstable_getViewportPageSize();
    var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    var rowIndexBefore = currentPageRows.findIndex(function (row) {
      return row.id === params.id;
    });
    var firstRowIndexInPage = 0;
    var lastRowIndexInPage = currentPageRows.length - 1;
    var firstColIndex = 0;
    var lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    var shouldPreventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        {
          // TODO v6: Remove Enter case because `cellNavigationKeyDown` is not fired by the new editing API
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore + 1));
          }

          break;
        }

      case 'ArrowUp':
        {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore - 1));
          } else {
            goToHeader(colIndexBefore, event);
          }

          break;
        }

      case 'ArrowRight':
        {
          if (colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }

          break;
        }

      case 'ArrowLeft':
        {
          if (colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore));
          }

          break;
        }

      case 'Tab':
        {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore), 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }

          break;
        }

      case ' ':
        {
          var field = params.field;

          if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            break;
          }

          var colDef = params.colDef;

          if (colDef && colDef.type === 'treeDataGroup') {
            break;
          }

          if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
          }

          break;
        }

      case 'PageDown':
        {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)));
          }

          break;
        }

      case 'PageUp':
        {
          // Go to the first row before going to header
          var nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);

          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(nextRowIndex));
          } else {
            goToHeader(colIndexBefore, event);
          }

          break;
        }

      case 'Home':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, getRowIdFromIndex(firstRowIndexInPage));
          } else {
            goToCell(firstColIndex, getRowIdFromIndex(rowIndexBefore));
          }

          break;
        }

      case 'End':
        {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, getRowIdFromIndex(lastRowIndexInPage));
          } else {
            goToCell(lastColIndex, getRowIdFromIndex(rowIndexBefore));
          }

          break;
        }

      default:
        {
          shouldPreventDefault = false;
        }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPageRows, goToCell, goToHeader, getRowIdFromIndex]);
  var handleColumnHeaderKeyDown = React.useCallback(function (params, event) {
    var headerTitleNode = event.currentTarget.querySelector(".".concat(gridClasses.columnHeaderTitleContainerContent));
    var isFromInsideContent = !!headerTitleNode && headerTitleNode.contains(event.target);

    if (isFromInsideContent && params.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
      // There is one exception for the checkBoxHeader
      return;
    }

    var dimensions = apiRef.current.getRootDimensions();

    if (!dimensions) {
      return;
    }

    var viewportPageSize = apiRef.current.unstable_getViewportPageSize();
    var colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
    var firstRowIndexInPage = 0;
    var lastRowIndexInPage = currentPageRows.length - 1;
    var firstColIndex = 0;
    var lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
    var shouldPreventDefault = true;

    switch (event.key) {
      case 'ArrowDown':
        {
          if (firstRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(firstRowIndexInPage));
          }

          break;
        }

      case 'ArrowRight':
        {
          if (colIndexBefore < lastColIndex) {
            goToHeader(colIndexBefore + 1, event);
          }

          break;
        }

      case 'ArrowLeft':
        {
          if (colIndexBefore > firstColIndex) {
            goToHeader(colIndexBefore - 1, event);
          }

          break;
        }

      case 'PageDown':
        {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(colIndexBefore, getRowIdFromIndex(Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage)));
          }

          break;
        }

      case 'Home':
        {
          goToHeader(firstColIndex, event);
          break;
        }

      case 'End':
        {
          goToHeader(lastColIndex, event);
          break;
        }

      case 'Enter':
        {
          if (event.ctrlKey || event.metaKey) {
            apiRef.current.toggleColumnMenu(params.field);
          }

          break;
        }

      case ' ':
        {
          // prevent Space event from scrolling
          break;
        }

      default:
        {
          shouldPreventDefault = false;
        }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  }, [apiRef, currentPageRows, goToCell, goToHeader, getRowIdFromIndex]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    // Ignore portal
    if (!event.currentTarget.contains(event.target)) {
      return;
    } // Get the most recent params because the cell mode may have changed by another listener


    var cellParams = apiRef.current.getCellParams(params.id, params.field);

    if (cellParams.cellMode !== GridCellModes.Edit && isNavigationKey(event.key)) {
      apiRef.current.publishEvent('cellNavigationKeyDown', cellParams, event);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'cellNavigationKeyDown', handleCellNavigationKeyDown);
  useGridApiEventHandler(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};