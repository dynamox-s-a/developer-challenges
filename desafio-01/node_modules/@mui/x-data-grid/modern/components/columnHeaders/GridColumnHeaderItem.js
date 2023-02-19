import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useId as useId } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderSortIcon } from './GridColumnHeaderSortIcon';
import { ColumnHeaderMenuIcon } from './ColumnHeaderMenuIcon';
import { GridColumnHeaderMenu } from '../menu/columnMenu/GridColumnHeaderMenu';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

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
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderItem(props) {
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
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef(null);
  const columnMenuId = useId();
  const columnMenuButtonId = useId();
  const iconButtonRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const {
    hasScrollX,
    hasScrollY
  } = apiRef.current.getRootDimensions() ?? {
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

  const ownerState = _extends({}, props, {
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

  const columnMenuIconButton = !rootProps.disableColumnMenu && !column.disableColumnMenu && /*#__PURE__*/_jsx(ColumnHeaderMenuIcon, {
    column: column,
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    open: showColumnMenuIcon,
    iconButtonRef: iconButtonRef
  });

  const columnMenu = /*#__PURE__*/_jsx(GridColumnHeaderMenu, {
    columnMenuId: columnMenuId,
    columnMenuButtonId: columnMenuButtonId,
    field: column.field,
    open: columnMenuOpen,
    target: iconButtonRef.current,
    ContentComponent: rootProps.components.ColumnMenu,
    contentComponentProps: rootProps.componentsProps?.columnMenu,
    onExited: handleExited
  });

  const sortingOrder = column.sortingOrder ?? rootProps.sortingOrder;

  const columnTitleIconButtons = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [!rootProps.disableColumnFilter && /*#__PURE__*/_jsx(rootProps.components.ColumnHeaderFilterIconButton, _extends({
      field: column.field,
      counter: filterItemsCounter
    }, rootProps.componentsProps?.columnHeaderFilterIconButton)), column.sortable && !column.hideSortIcons && /*#__PURE__*/_jsx(GridColumnHeaderSortIcon, {
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
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  const headerClassName = typeof column.headerClassName === 'function' ? column.headerClassName({
    field: column.field,
    colDef: column
  }) : column.headerClassName;
  const label = column.headerName ?? column.field;
  return /*#__PURE__*/_jsx(GridGenericColumnHeaderItem, _extends({
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
  colIndex: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  columnMenuOpen: PropTypes.bool.isRequired,
  disableReorder: PropTypes.bool,
  extendRowFullWidth: PropTypes.bool.isRequired,
  filterItemsCounter: PropTypes.number,
  hasFocus: PropTypes.bool,
  headerHeight: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isLastColumn: PropTypes.bool.isRequired,
  isResizing: PropTypes.bool.isRequired,
  separatorSide: PropTypes.oneOf(['left', 'right']),
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  sortIndex: PropTypes.number,
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired
} : void 0;
export { GridColumnHeaderItem };