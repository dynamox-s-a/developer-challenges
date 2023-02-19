"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRow = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _material = require("@mui/material");

var _gridEditRowModel = require("../models/gridEditRowModel");

var _useGridApiContext = require("../hooks/utils/useGridApiContext");

var _gridClasses = require("../constants/gridClasses");

var _useGridRootProps = require("../hooks/utils/useGridRootProps");

var _gridColumnsSelector = require("../hooks/features/columns/gridColumnsSelector");

var _useGridSelector = require("../hooks/utils/useGridSelector");

var _useGridVisibleRows = require("../hooks/utils/useGridVisibleRows");

var _domUtils = require("../utils/domUtils");

var _gridCheckboxSelectionColDef = require("../colDef/gridCheckboxSelectionColDef");

var _gridActionsColDef = require("../colDef/gridActionsColDef");

var _gridDetailPanelToggleField = require("../constants/gridDetailPanelToggleField");

var _gridSortingSelector = require("../hooks/features/sorting/gridSortingSelector");

var _gridRowsSelector = require("../hooks/features/rows/gridRowsSelector");

var _densitySelector = require("../hooks/features/density/densitySelector");

var _utils = require("../utils/utils");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["selected", "rowId", "row", "index", "style", "position", "rowHeight", "className", "visibleColumns", "renderedColumns", "containerWidth", "firstColumnToRender", "lastColumnToRender", "cellFocus", "cellTabIndex", "editRowsState", "isLastVisible", "onClick", "onDoubleClick", "onMouseEnter", "onMouseLeave"],
      _excluded2 = ["changeReason"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    editable,
    editing,
    selected,
    isLastVisible,
    rowHeight,
    classes
  } = ownerState;
  const slots = {
    root: ['row', selected && 'selected', editable && 'row--editable', editing && 'row--editing', isLastVisible && 'row--lastVisible', rowHeight === 'auto' && 'row--dynamicHeight']
  };
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

const EmptyCell = ({
  width
}) => {
  if (!width) {
    return null;
  }

  const style = {
    width
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "MuiDataGrid-cell",
    style: style
  }); // TODO change to .MuiDataGrid-emptyCell or .MuiDataGrid-rowFiller
};

const GridRow = /*#__PURE__*/React.forwardRef(function GridRow(props, refProp) {
  var _apiRef$current$getRo;

  const {
    selected,
    rowId,
    row,
    index,
    style: styleProp,
    position,
    rowHeight,
    className,
    visibleColumns,
    renderedColumns,
    containerWidth,
    firstColumnToRender,
    cellFocus,
    cellTabIndex,
    editRowsState,
    isLastVisible = false,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const ref = React.useRef(null);
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const currentPage = (0, _useGridVisibleRows.useGridVisibleRows)(apiRef, rootProps);
  const columnsTotalWidth = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridColumnsTotalWidthSelector);
  const sortModel = (0, _useGridSelector.useGridSelector)(apiRef, _gridSortingSelector.gridSortModelSelector);
  const treeDepth = (0, _useGridSelector.useGridSelector)(apiRef, _gridRowsSelector.gridRowTreeDepthSelector);
  const headerGroupingMaxDepth = (0, _useGridSelector.useGridSelector)(apiRef, _densitySelector.gridDensityHeaderGroupingMaxDepthSelector);
  const handleRef = (0, _material.useForkRef)(ref, refProp);
  const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based

  const {
    hasScrollX,
    hasScrollY
  } = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  };
  const ownerState = {
    selected,
    isLastVisible,
    classes: rootProps.classes,
    editing: apiRef.current.getRowMode(rowId) === _gridEditRowModel.GridRowModes.Edit,
    editable: rootProps.editMode === _gridEditRowModel.GridEditModes.Row,
    rowHeight
  };
  const classes = useUtilityClasses(ownerState);
  React.useLayoutEffect(() => {
    if (rowHeight === 'auto' && ref.current && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, ref.current.clientHeight, position);
    }
  }, [apiRef, rowHeight, rowId, position]);
  React.useLayoutEffect(() => {
    if (currentPage.range) {
      // The index prop is relative to the rows from all pages. As example, the index prop of the
      // first row is 5 if pageSize=5 and page=1. However, the index used by the virtualization
      // doesn't care about pagination and considers the rows from the current page only, so the
      // first row always has index=0. We need to subtract the index of the first row to make it
      // compatible with the index used by the virtualization.
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId); // pinned rows are not part of the visible rows

      if (rowIndex != null) {
        apiRef.current.unstable_setLastMeasuredRowIndex(rowIndex);
      }
    }

    const rootElement = ref.current;
    const hasFixedHeight = rowHeight !== 'auto';

    if (!rootElement || hasFixedHeight || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(entries => {
      const [entry] = entries;
      const height = entry.borderBoxSize && entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.contentRect.height;
      apiRef.current.unstable_storeRowHeightMeasurement(rowId, height, position);
    });
    resizeObserver.observe(rootElement);
    return () => resizeObserver.disconnect();
  }, [apiRef, currentPage.range, index, rowHeight, rowId, position]);
  const publish = React.useCallback((eventName, propHandler) => event => {
    // Ignore portal
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    } // The row might have been deleted


    if (!apiRef.current.getRow(rowId)) {
      return;
    }

    apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(rowId), event);

    if (propHandler) {
      propHandler(event);
    }
  }, [apiRef, rowId]);
  const publishClick = React.useCallback(event => {
    const cell = (0, _domUtils.findParentElementFromClassName)(event.target, _gridClasses.gridClasses.cell);
    const field = cell == null ? void 0 : cell.getAttribute('data-field'); // Check if the field is available because the cell that fills the empty
    // space of the row has no field.

    if (field) {
      // User clicked in the checkbox added by checkboxSelection
      if (field === _gridCheckboxSelectionColDef.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        return;
      } // User opened a detail panel


      if (field === _gridDetailPanelToggleField.GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        return;
      } // User reorders a row


      if (field === '__reorder__') {
        return;
      } // User is editing a cell


      if (apiRef.current.getCellMode(rowId, field) === _gridEditRowModel.GridCellModes.Edit) {
        return;
      } // User clicked a button from the "actions" column type


      const column = apiRef.current.getColumn(field);

      if (column.type === _gridActionsColDef.GRID_ACTIONS_COLUMN_TYPE) {
        return;
      }
    }

    publish('rowClick', onClick)(event);
  }, [apiRef, onClick, publish, rowId]);
  const getCell = React.useCallback((column, cellProps) => {
    var _rootProps$components;

    const cellParams = apiRef.current.getCellParams(rowId, column.field);
    const classNames = [];
    const disableDragEvents = rootProps.disableColumnReorder && column.disableReorder || !rootProps.rowReordering && !!sortModel.length && treeDepth > 1 && Object.keys(editRowsState).length > 0;

    if (column.cellClassName) {
      classNames.push((0, _clsx.default)(typeof column.cellClassName === 'function' ? column.cellClassName(cellParams) : column.cellClassName));
    }

    const editCellState = editRowsState[rowId] ? editRowsState[rowId][column.field] : null;
    let content = null;

    if (editCellState == null && column.renderCell) {
      var _rootProps$classes;

      content = column.renderCell((0, _extends2.default)({}, cellParams, {
        api: apiRef.current
      })); // TODO move to GridCell

      classNames.push((0, _clsx.default)(_gridClasses.gridClasses['cell--withRenderer'], (_rootProps$classes = rootProps.classes) == null ? void 0 : _rootProps$classes['cell--withRenderer']));
    }

    if (editCellState != null && column.renderEditCell) {
      var _rootProps$classes2;

      let updatedRow = row;

      if (apiRef.current.unstable_getRowWithUpdatedValues) {
        // Only the new editing API has this method
        updatedRow = apiRef.current.unstable_getRowWithUpdatedValues(rowId, column.field);
      }

      const editCellStateRest = (0, _objectWithoutPropertiesLoose2.default)(editCellState, _excluded2);
      const params = (0, _extends2.default)({}, cellParams, {
        row: updatedRow
      }, editCellStateRest, {
        api: apiRef.current
      });
      content = column.renderEditCell(params); // TODO move to GridCell

      classNames.push((0, _clsx.default)(_gridClasses.gridClasses['cell--editing'], (_rootProps$classes2 = rootProps.classes) == null ? void 0 : _rootProps$classes2['cell--editing']));
    }

    if (rootProps.getCellClassName) {
      // TODO move to GridCell
      classNames.push(rootProps.getCellClassName(cellParams));
    }

    const hasFocus = cellFocus !== null && cellFocus.id === rowId && cellFocus.field === column.field;
    const tabIndex = cellTabIndex !== null && cellTabIndex.id === rowId && cellTabIndex.field === column.field && cellParams.cellMode === 'view' ? 0 : -1;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.Cell, (0, _extends2.default)({
      value: cellParams.value,
      field: column.field,
      width: cellProps.width,
      rowId: rowId,
      height: rowHeight,
      showRightBorder: cellProps.showRightBorder,
      formattedValue: cellParams.formattedValue,
      align: column.align || 'left',
      cellMode: cellParams.cellMode,
      colIndex: cellProps.indexRelativeToAllColumns,
      isEditable: cellParams.isEditable,
      hasFocus: hasFocus,
      tabIndex: tabIndex,
      className: (0, _clsx.default)(classNames),
      colSpan: cellProps.colSpan,
      disableDragEvents: disableDragEvents
    }, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.cell, {
      children: content
    }), column.field);
  }, [apiRef, cellTabIndex, editRowsState, cellFocus, rootProps, row, rowHeight, rowId, treeDepth, sortModel.length]);
  const sizes = apiRef.current.unstable_getRowInternalSizes(rowId);
  let minHeight = rowHeight;

  if (minHeight === 'auto' && sizes) {
    let numberOfBaseSizes = 0;
    const maximumSize = Object.entries(sizes).reduce((acc, [key, size]) => {
      const isBaseHeight = /^base[A-Z]/.test(key);

      if (!isBaseHeight) {
        return acc;
      }

      numberOfBaseSizes += 1;

      if (size > acc) {
        return size;
      }

      return acc;
    }, 0);

    if (maximumSize > 0 && numberOfBaseSizes > 1) {
      minHeight = maximumSize;
    }
  }

  const style = (0, _extends2.default)({}, styleProp, {
    maxHeight: rowHeight === 'auto' ? 'none' : rowHeight,
    // max-height doesn't support "auto"
    minHeight
  });

  if (sizes != null && sizes.spacingTop) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
    style[property] = sizes.spacingTop;
  }

  if (sizes != null && sizes.spacingBottom) {
    const property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
    let propertyValue = style[property]; // avoid overriding existing value

    if (typeof propertyValue !== 'number') {
      propertyValue = parseInt(propertyValue || '0', 10);
    }

    propertyValue += sizes.spacingBottom;
    style[property] = propertyValue;
  }

  const rowClassNames = apiRef.current.unstable_applyPipeProcessors('rowClassName', [], rowId);

  if (typeof rootProps.getRowClassName === 'function') {
    var _currentPage$range;

    const indexRelativeToCurrentPage = index - (((_currentPage$range = currentPage.range) == null ? void 0 : _currentPage$range.firstRowIndex) || 0);
    const rowParams = (0, _extends2.default)({}, apiRef.current.getRowParams(rowId), {
      isFirstVisible: indexRelativeToCurrentPage === 0,
      isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
      indexRelativeToCurrentPage
    });
    rowClassNames.push(rootProps.getRowClassName(rowParams));
  }

  const randomNumber = (0, _utils.randomNumberBetween)(10000, 20, 80);
  const cells = [];

  for (let i = 0; i < renderedColumns.length; i += 1) {
    const column = renderedColumns[i];
    const indexRelativeToAllColumns = firstColumnToRender + i;
    const isLastColumn = indexRelativeToAllColumns === visibleColumns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn ? rootProps.showCellRightBorder : !removeLastBorderRight && rootProps.disableExtendRowFullWidth;
    const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, indexRelativeToAllColumns);

    if (cellColSpanInfo && !cellColSpanInfo.spannedByColSpan) {
      if (row) {
        const {
          colSpan,
          width
        } = cellColSpanInfo.cellProps;
        const cellProps = {
          width,
          colSpan,
          showRightBorder,
          indexRelativeToAllColumns
        };
        cells.push(getCell(column, cellProps));
      } else {
        const {
          width
        } = cellColSpanInfo.cellProps;
        const contentWidth = Math.round(randomNumber());
        cells.push( /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.SkeletonCell, {
          width: width,
          contentWidth: contentWidth,
          field: column.field,
          align: column.align
        }, column.field));
      }
    }
  }

  const emptyCellWidth = containerWidth - columnsTotalWidth;
  const eventHandlers = row ? {
    onClick: publishClick,
    onDoubleClick: publish('rowDoubleClick', onDoubleClick),
    onMouseEnter: publish('rowMouseEnter', onMouseEnter),
    onMouseLeave: publish('rowMouseLeave', onMouseLeave)
  } : null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", (0, _extends2.default)({
    ref: handleRef,
    "data-id": rowId,
    "data-rowindex": index,
    role: "row",
    className: (0, _clsx.default)(...rowClassNames, classes.root, className),
    "aria-rowindex": ariaRowIndex,
    "aria-selected": selected,
    style: style
  }, eventHandlers, other, {
    children: [cells, emptyCellWidth > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)(EmptyCell, {
      width: emptyCellWidth
    })]
  }));
});
exports.GridRow = GridRow;
process.env.NODE_ENV !== "production" ? GridRow.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  cellFocus: _propTypes.default.object,
  cellTabIndex: _propTypes.default.object,
  containerWidth: _propTypes.default.number.isRequired,
  editRowsState: _propTypes.default.object.isRequired,
  firstColumnToRender: _propTypes.default.number.isRequired,

  /**
   * Index of the row in the whole sorted and filtered dataset.
   * If some rows above have expanded children, this index also take those children into account.
   */
  index: _propTypes.default.number.isRequired,
  isLastVisible: _propTypes.default.bool,
  lastColumnToRender: _propTypes.default.number.isRequired,
  position: _propTypes.default.oneOf(['center', 'left', 'right']).isRequired,
  renderedColumns: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  row: _propTypes.default.object,
  rowHeight: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.number]).isRequired,
  rowId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  selected: _propTypes.default.bool.isRequired,
  visibleColumns: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
} : void 0;