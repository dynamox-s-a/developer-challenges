"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnHeaderItem = GridColumnHeaderItem;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _material = require("@mui/material");

var _utils = require("@mui/material/utils");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _GridColumnHeaderSortIcon = require("./GridColumnHeaderSortIcon");

var _ColumnHeaderMenuIcon = require("./ColumnHeaderMenuIcon");

var _GridColumnHeaderMenu = require("../menu/columnMenu/GridColumnHeaderMenu");

var _gridClasses = require("../../constants/gridClasses");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _GridGenericColumnHeaderItem = require("./GridGenericColumnHeaderItem");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    column,
    classes,
    isDragging,
    sortDirection,
    showRightBorder,
    filterItemsCounter
  } = ownerState;
  const isColumnSorted = sortDirection != null;
  const isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0; // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work

  const isColumnNumeric = column.type === 'number';
  const slots = {
    root: ['columnHeader', column.headerAlign === 'left' && 'columnHeader--alignLeft', column.headerAlign === 'center' && 'columnHeader--alignCenter', column.headerAlign === 'right' && 'columnHeader--alignRight', column.sortable && 'columnHeader--sortable', isDragging && 'columnHeader--moving', isColumnSorted && 'columnHeader--sorted', isColumnFiltered && 'columnHeader--filtered', isColumnNumeric && 'columnHeader--numeric', showRightBorder && 'withBorder'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props) {
  var _apiRef$current$getRo, _rootProps$components, _column$sortingOrder, _rootProps$components2, _column$headerName;

  const {
    column,
    columnMenuOpen,
    colIndex,
    headerHeight,
    isResizing,
    isLastColumn,
    sortDirection,
    sortIndex,
    filterItemsCounter,
    hasFocus,
    tabIndex,
    extendRowFullWidth,
    disableReorder,
    separatorSide
  } = props;
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const headerCellRef = React.useRef(null);
  const columnMenuId = (0, _utils.unstable_useId)();
  const columnMenuButtonId = (0, _utils.unstable_useId)();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const {
    hasScrollX,
    hasScrollY
  } = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  };
  const isDraggable = React.useMemo(() => !rootProps.disableColumnReorder && !disableReorder && !column.disableReorder, [rootProps.disableColumnReorder, disableReorder, column.disableReorder]);
  let headerComponent;

  if (column.renderHeader) {
    headerComponent = column.renderHeader(apiRef.current.getColumnHeaderParams(column.field));
  }

  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;
  const ownerState = (0, _extends2.default)({}, props, {
    classes: rootProps.classes,
    showRightBorder
  });
  const classes = useUtilityClasses(ownerState);
  const publish = React.useCallback(eventName => event => {
    // Ignore portal
    // See https://github.com/mui/mui-x/issues/1721
    if (!event.currentTarget.contains(event.target)) {
      return;
    }

    apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(column.field), event);
  }, [apiRef, column.field]);
  const mouseEventsHandlers = React.useMemo(() => ({
    onClick: publish('columnHeaderClick'),
    onDoubleClick: publish('columnHeaderDoubleClick'),
    onMouseOver: publish('columnHeaderOver'),
    // TODO remove as it's not used
    onMouseOut: publish('columnHeaderOut'),
    // TODO remove as it's not used
    onMouseEnter: publish('columnHeaderEnter'),
    // TODO remove as it's not used
    onMouseLeave: publish('columnHeaderLeave'),
    // TODO remove as it's not used
    onKeyDown: publish('columnHeaderKeyDown'),
    onFocus: publish('columnHeaderFocus'),
    onBlur: publish('columnHeaderBlur')
  }), [publish]);
  const draggableEventHandlers = React.useMemo(() => isDraggable ? {
    onDragStart: publish('columnHeaderDragStart'),
    onDragEnter: publish('columnHeaderDragEnter'),
    onDragOver: publish('columnHeaderDragOver'),
    onDragEnd: publish('columnHeaderDragEnd')
  } : {}, [isDraggable, publish]);
  const columnHeaderSeparatorProps = React.useMemo(() => ({
    onMouseDown: publish('columnSeparatorMouseDown')
  }), [publish]);
  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  const handleExited = React.useCallback(() => {
    setShowColumnMenuIcon(false);
  }, []);
  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ColumnHeaderMenuIcon.ColumnHeaderMenuIcon, {
    column: column,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });
  const columnMenu = /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderMenu.GridColumnHeaderMenu, {
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    field: column.field,
    open: columnMenuOpen,
    target: iconButtonRef.current,
    ContentComponent: rootProps.components.ColumnMenu,
    contentComponentProps: (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.columnMenu,
    onExited: handleExited
  });
  const sortingOrder = (_column$sortingOrder = column.sortingOrder) != null ? _column$sortingOrder : rootProps.sortingOrder;
  const columnTitleIconButtons = /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.ColumnHeaderFilterIconButton, (0, _extends2.default)({
      field: column.field,
      counter: filterItemsCounter
    }, (_rootProps$components2 = rootProps.componentsProps) == null ? void 0 : _rootProps$components2.columnHeaderFilterIconButton)), column.sortable && !column.hideSortIcons && /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridColumnHeaderSortIcon.GridColumnHeaderSortIcon, {
      direction: sortDirection,
      index: sortIndex,
      sortingOrder: sortingOrder
    })]
  });
  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;

    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus == null ? void 0 : elementToFocus.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  const headerClassName = typeof column.headerClassName === 'function' ? column.headerClassName({
    field: column.field,
    colDef: column
  }) : column.headerClassName;
  const label = (_column$headerName = column.headerName) != null ? _column$headerName : column.field;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridGenericColumnHeaderItem.GridGenericColumnHeaderItem, (0, _extends2.default)({
    ref: headerCellRef,
    classes: classes,
    columnMenuOpen: columnMenuOpen,
    colIndex: colIndex,
    height: headerHeight,
    isResizing: isResizing,
    sortDirection: sortDirection,
    hasFocus: hasFocus,
    tabIndex: tabIndex,
    separatorSide: separatorSide,
    isDraggable: isDraggable,
    headerComponent: headerComponent,
    description: column.description,
    elementId: column.field,
    width: column.computedWidth,
    columnMenuIconButton: columnMenuIconButton,
    columnTitleIconButtons: columnTitleIconButtons,
    headerClassName: headerClassName,
    label: label,
    resizable: !rootProps.disableColumnResize && !!column.resizable,
    "data-field": column.field,
    columnMenu: columnMenu,
    draggableContainerProps: draggableEventHandlers,
    columnHeaderSeparatorProps: columnHeaderSeparatorProps
  }, mouseEventsHandlers));
}

process.env.NODE_ENV !== "production" ? GridColumnHeaderItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colIndex: _propTypes.default.number.isRequired,
  column: _propTypes.default.object.isRequired,
  columnMenuOpen: _propTypes.default.bool.isRequired,
  disableReorder: _propTypes.default.bool,
  extendRowFullWidth: _propTypes.default.bool.isRequired,
  filterItemsCounter: _propTypes.default.number,
  hasFocus: _propTypes.default.bool,
  headerHeight: _propTypes.default.number.isRequired,
  isDragging: _propTypes.default.bool.isRequired,
  isLastColumn: _propTypes.default.bool.isRequired,
  isResizing: _propTypes.default.bool.isRequired,
  separatorSide: _propTypes.default.oneOf(['left', 'right']),
  sortDirection: _propTypes.default.oneOf(['asc', 'desc']),
  sortIndex: _propTypes.default.number,
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired
} : void 0;