import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import { gridSelectionStateSelector, selectedGridRowsSelector, selectedIdsLookupSelector } from './gridSelectionSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../pagination';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { gridVisibleSortedRowIdsSelector } from '../filter/gridFilterSelector';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_ACTIONS_COLUMN_TYPE } from '../../../colDef';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isKeyboardEvent, isNavigationKey } from '../../../utils/keyboardUtils';
import { getVisibleRows, useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../constants/gridDetailPanelToggleField';
import { gridClasses } from '../../../constants/gridClasses';

var getSelectionModelPropValue = function getSelectionModelPropValue(selectionModelProp, prevSelectionModel) {
  if (selectionModelProp == null) {
    return selectionModelProp;
  }

  if (Array.isArray(selectionModelProp)) {
    return selectionModelProp;
  }

  if (prevSelectionModel && prevSelectionModel[0] === selectionModelProp) {
    return prevSelectionModel;
  }

  return [selectionModelProp];
};

export var selectionStateInitializer = function selectionStateInitializer(state, props) {
  var _getSelectionModelPro;

  return _extends({}, state, {
    selection: (_getSelectionModelPro = getSelectionModelPropValue(props.selectionModel)) != null ? _getSelectionModelPro : []
  });
};
/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */

export var useGridSelection = function useGridSelection(apiRef, props) {
  var logger = useGridLogger(apiRef, 'useGridSelection');
  var propSelectionModel = React.useMemo(function () {
    return getSelectionModelPropValue(props.selectionModel, gridSelectionStateSelector(apiRef.current.state));
  }, [apiRef, props.selectionModel]);
  var lastRowToggled = React.useRef(null);
  apiRef.current.unstable_registerControlState({
    stateId: 'selection',
    propModel: propSelectionModel,
    propOnChange: props.onSelectionModelChange,
    stateSelector: gridSelectionStateSelector,
    changeEvent: 'selectionChange'
  });
  var checkboxSelection = props.checkboxSelection,
      disableMultipleSelection = props.disableMultipleSelection,
      disableSelectionOnClick = props.disableSelectionOnClick,
      pagination = props.pagination,
      paginationMode = props.paginationMode,
      propIsRowSelectable = props.isRowSelectable;
  var canHaveMultipleSelection = !disableMultipleSelection || checkboxSelection;
  var visibleRows = useGridVisibleRows(apiRef, props);
  var expandMouseRowRangeSelection = React.useCallback(function (id) {
    var _lastRowToggled$curre;

    var endId = id;
    var startId = (_lastRowToggled$curre = lastRowToggled.current) != null ? _lastRowToggled$curre : id;
    var isSelected = apiRef.current.isRowSelected(id);

    if (isSelected) {
      var visibleRowIds = gridVisibleSortedRowIdsSelector(apiRef);
      var startIndex = visibleRowIds.findIndex(function (rowId) {
        return rowId === startId;
      });
      var endIndex = visibleRowIds.findIndex(function (rowId) {
        return rowId === endId;
      });

      if (startIndex === endIndex) {
        return;
      }

      if (startIndex > endIndex) {
        endId = visibleRowIds[endIndex + 1];
      } else {
        endId = visibleRowIds[endIndex - 1];
      }
    }

    lastRowToggled.current = id;
    apiRef.current.selectRowRange({
      startId: startId,
      endId: endId
    }, !isSelected);
  }, [apiRef]);
  /**
   * API METHODS
   */

  var setSelectionModel = React.useCallback(function (model) {
    var currentModel = gridSelectionStateSelector(apiRef.current.state);

    if (currentModel !== model) {
      logger.debug("Setting selection model");
      apiRef.current.setState(function (state) {
        return _extends({}, state, {
          selection: model
        });
      });
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);
  var isRowSelected = React.useCallback(function (id) {
    return gridSelectionStateSelector(apiRef.current.state).includes(id);
  }, [apiRef]);
  var isRowSelectable = React.useCallback(function (id) {
    if (propIsRowSelectable && !propIsRowSelectable(apiRef.current.getRowParams(id))) {
      return false;
    }

    var rowNode = apiRef.current.getRowNode(id);

    if ((rowNode == null ? void 0 : rowNode.position) === 'footer' || rowNode != null && rowNode.isPinned) {
      return false;
    }

    return true;
  }, [apiRef, propIsRowSelectable]);
  var getSelectedRows = React.useCallback(function () {
    return selectedGridRowsSelector(apiRef);
  }, [apiRef]);
  var selectRow = React.useCallback(function (id) {
    var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var resetSelection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!apiRef.current.isRowSelectable(id)) {
      return;
    }

    lastRowToggled.current = id;

    if (resetSelection) {
      logger.debug("Setting selection for row ".concat(id));
      apiRef.current.setSelectionModel(isSelected ? [id] : []);
    } else {
      logger.debug("Toggling selection for row ".concat(id));
      var selection = gridSelectionStateSelector(apiRef.current.state);
      var newSelection = selection.filter(function (el) {
        return el !== id;
      });

      if (isSelected) {
        newSelection.push(id);
      }

      var isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;

      if (isSelectionValid) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, logger, canHaveMultipleSelection]);
  var selectRows = React.useCallback(function (ids) {
    var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var resetSelection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    logger.debug("Setting selection for several rows");
    var selectableIds = ids.filter(function (id) {
      return apiRef.current.isRowSelectable(id);
    });
    var newSelection;

    if (resetSelection) {
      newSelection = isSelected ? selectableIds : [];
    } else {
      // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
      var selectionLookup = _extends({}, selectedIdsLookupSelector(apiRef));

      selectableIds.forEach(function (id) {
        if (isSelected) {
          selectionLookup[id] = id;
        } else {
          delete selectionLookup[id];
        }
      });
      newSelection = Object.values(selectionLookup);
    }

    var isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;

    if (isSelectionValid) {
      apiRef.current.setSelectionModel(newSelection);
    }
  }, [apiRef, logger, canHaveMultipleSelection]);
  var selectRowRange = React.useCallback(function (_ref) {
    var startId = _ref.startId,
        endId = _ref.endId;
    var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var resetSelection = arguments.length > 2 ? arguments[2] : undefined;

    if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
      return;
    }

    logger.debug("Expanding selection from row ".concat(startId, " to row ").concat(endId)); // Using rows from all pages allow to select a range across several pages

    var allPagesRowIds = gridVisibleSortedRowIdsSelector(apiRef);
    var startIndex = allPagesRowIds.indexOf(startId);
    var endIndex = allPagesRowIds.indexOf(endId);

    var _ref2 = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex],
        _ref3 = _slicedToArray(_ref2, 2),
        start = _ref3[0],
        end = _ref3[1];

    var rowsBetweenStartAndEnd = allPagesRowIds.slice(start, end + 1);
    apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
  }, [apiRef, logger]);
  var selectionApi = {
    selectRow: selectRow,
    selectRows: selectRows,
    selectRowRange: selectRowRange,
    setSelectionModel: setSelectionModel,
    getSelectedRows: getSelectedRows,
    isRowSelected: isRowSelected,
    isRowSelectable: isRowSelectable
  };
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');
  /**
   * EVENTS
   */

  var removeOutdatedSelection = React.useCallback(function () {
    if (props.keepNonExistentRowsSelected) {
      return;
    }

    var currentSelection = gridSelectionStateSelector(apiRef.current.state);
    var rowsLookup = gridRowsLookupSelector(apiRef); // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project

    var selectionLookup = _extends({}, selectedIdsLookupSelector(apiRef));

    var hasChanged = false;
    currentSelection.forEach(function (id) {
      if (!rowsLookup[id]) {
        delete selectionLookup[id];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      apiRef.current.setSelectionModel(Object.values(selectionLookup));
    }
  }, [apiRef, props.keepNonExistentRowsSelected]);
  var handleSingleRowSelection = React.useCallback(function (id, event) {
    var hasCtrlKey = event.metaKey || event.ctrlKey; // multiple selection is only allowed if:
    // - it is a checkboxSelection
    // - it is a keyboard selection
    // - Ctrl is pressed

    var isMultipleSelectionDisabled = !checkboxSelection && !hasCtrlKey && !isKeyboardEvent(event);
    var resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;
    var isSelected = apiRef.current.isRowSelected(id);

    if (resetSelection) {
      apiRef.current.selectRow(id, !isMultipleSelectionDisabled ? !isSelected : true, true);
    } else {
      apiRef.current.selectRow(id, !isSelected, false);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection]);
  var handleRowClick = React.useCallback(function (params, event) {
    var _closest;

    if (disableSelectionOnClick) {
      return;
    }

    var field = (_closest = event.target.closest(".".concat(gridClasses.cell))) == null ? void 0 : _closest.getAttribute('data-field');

    if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
      // click on checkbox should not trigger row selection
      return;
    }

    if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
      // click to open the detail panel should not select the row
      return;
    }

    if (field) {
      var column = apiRef.current.getColumn(field);

      if (column.type === GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
    }

    var rowNode = apiRef.current.getRowNode(params.id);

    if (rowNode.isPinned) {
      return;
    }

    if (event.shiftKey && (canHaveMultipleSelection || checkboxSelection)) {
      expandMouseRowRangeSelection(params.id);
    } else {
      handleSingleRowSelection(params.id, event);
    }
  }, [disableSelectionOnClick, canHaveMultipleSelection, checkboxSelection, apiRef, expandMouseRowRangeSelection, handleSingleRowSelection]);
  var preventSelectionOnShift = React.useCallback(function (params, event) {
    if (canHaveMultipleSelection && event.shiftKey) {
      var _window$getSelection;

      (_window$getSelection = window.getSelection()) == null ? void 0 : _window$getSelection.removeAllRanges();
    }
  }, [canHaveMultipleSelection]);
  var handleRowSelectionCheckboxChange = React.useCallback(function (params, event) {
    if (event.nativeEvent.shiftKey) {
      expandMouseRowRangeSelection(params.id);
    } else {
      apiRef.current.selectRow(params.id, params.value);
    }
  }, [apiRef, expandMouseRowRangeSelection]);
  var handleHeaderSelectionCheckboxChange = React.useCallback(function (params) {
    var shouldLimitSelectionToCurrentPage = props.checkboxSelectionVisibleOnly && props.pagination;
    var rowsToBeSelected = shouldLimitSelectionToCurrentPage ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef) : gridVisibleSortedRowIdsSelector(apiRef);
    apiRef.current.selectRows(rowsToBeSelected, params.value);
  }, [apiRef, props.checkboxSelectionVisibleOnly, props.pagination]);
  var handleCellKeyDown = React.useCallback(function (params, event) {
    // Get the most recent cell mode because it may have been changed by another listener
    if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
      return;
    } // Ignore portal
    // Do not apply shortcuts if the focus is not on the cell root component


    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    if (isNavigationKey(event.key) && event.shiftKey) {
      // The cell that has focus after the keyboard navigation
      var focusCell = gridFocusCellSelector(apiRef);

      if (focusCell && focusCell.id !== params.id) {
        event.preventDefault();
        var isNextRowSelected = apiRef.current.isRowSelected(focusCell.id);

        if (!canHaveMultipleSelection) {
          apiRef.current.selectRow(focusCell.id, !isNextRowSelected, true);
          return;
        }

        var newRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(focusCell.id);
        var previousRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);
        var start;
        var end;

        if (newRowIndex > previousRowIndex) {
          if (isNextRowSelected) {
            // We are navigating to the bottom of the page and adding selected rows
            start = previousRowIndex;
            end = newRowIndex - 1;
          } else {
            // We are navigating to the bottom of the page and removing selected rows
            start = previousRowIndex;
            end = newRowIndex;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (isNextRowSelected) {
            // We are navigating to the top of the page and removing selected rows
            start = newRowIndex + 1;
            end = previousRowIndex;
          } else {
            // We are navigating to the top of the page and adding selected rows
            start = newRowIndex;
            end = previousRowIndex;
          }
        }

        var rowsBetweenStartAndEnd = visibleRows.rows.slice(start, end + 1).map(function (row) {
          return row.id;
        });
        apiRef.current.selectRows(rowsBetweenStartAndEnd, !isNextRowSelected);
        return;
      }
    }

    if (event.key === ' ' && event.shiftKey) {
      event.preventDefault();
      handleSingleRowSelection(params.id, event);
      return;
    }

    if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      selectRows(apiRef.current.getAllRowIds(), true);
    }
  }, [apiRef, handleSingleRowSelection, selectRows, visibleRows.rows, canHaveMultipleSelection]);
  useGridApiEventHandler(apiRef, 'sortedRowsSet', removeOutdatedSelection);
  useGridApiEventHandler(apiRef, 'rowClick', handleRowClick);
  useGridApiEventHandler(apiRef, 'rowSelectionCheckboxChange', handleRowSelectionCheckboxChange);
  useGridApiEventHandler(apiRef, 'headerSelectionCheckboxChange', handleHeaderSelectionCheckboxChange);
  useGridApiEventHandler(apiRef, 'cellMouseDown', preventSelectionOnShift);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  /**
   * EFFECTS
   */

  React.useEffect(function () {
    if (propSelectionModel !== undefined) {
      apiRef.current.setSelectionModel(propSelectionModel);
    }
  }, [apiRef, propSelectionModel]);
  var isStateControlled = propSelectionModel != null;
  React.useEffect(function () {
    if (isStateControlled) {
      return;
    } // props.isRowSelectable changed


    var currentSelection = gridSelectionStateSelector(apiRef.current.state);

    if (isRowSelectable) {
      var newSelection = currentSelection.filter(function (id) {
        return isRowSelectable(id);
      });

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, isStateControlled]);
  React.useEffect(function () {
    var currentSelection = gridSelectionStateSelector(apiRef.current.state);

    if (!canHaveMultipleSelection && currentSelection.length > 1) {
      var _getVisibleRows = getVisibleRows(apiRef, {
        pagination: pagination,
        paginationMode: paginationMode
      }),
          currentPageRows = _getVisibleRows.rows;

      var currentPageRowsLookup = currentPageRows.reduce(function (acc, _ref4) {
        var id = _ref4.id;
        acc[id] = true;
        return acc;
      }, {});
      var firstSelectableRow = currentSelection.find(function (id) {
        var isSelectable = true;

        if (isRowSelectable) {
          isSelectable = isRowSelectable(id);
        }

        return isSelectable && currentPageRowsLookup[id]; // Check if the row is in the current page
      });
      apiRef.current.setSelectionModel(firstSelectableRow !== undefined ? [firstSelectableRow] : []);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection, disableMultipleSelection, isRowSelectable, pagination, paginationMode]);
};