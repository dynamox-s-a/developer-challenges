import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["classes", "columnMenuOpen", "colIndex", "height", "isResizing", "sortDirection", "hasFocus", "tabIndex", "separatorSide", "isDraggable", "headerComponent", "description", "elementId", "width", "columnMenuIconButton", "columnMenu", "columnTitleIconButtons", "headerClassName", "label", "resizable", "draggableContainerProps", "columnHeaderSeparatorProps", "disableHeaderSeparator"];
import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@mui/material/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridColumnHeaderTitle } from './GridColumnHeaderTitle';
import { GridColumnHeaderSeparator } from './GridColumnHeaderSeparator';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const GridGenericColumnHeaderItem = /*#__PURE__*/React.forwardRef(function GridGenericColumnHeaderItem(props, ref) {
  const {
    classes,
    columnMenuOpen,
    colIndex,
    height,
    isResizing,
    sortDirection,
    hasFocus,
    tabIndex,
    separatorSide,
    isDraggable,
    headerComponent,
    description,
    width,
    columnMenuIconButton = null,
    columnMenu = null,
    columnTitleIconButtons = null,
    headerClassName,
    label,
    resizable,
    draggableContainerProps,
    columnHeaderSeparatorProps,
    disableHeaderSeparator
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerCellRef = React.useRef(null);
  const [showColumnMenuIcon, setShowColumnMenuIcon] = React.useState(columnMenuOpen);
  const handleRef = useForkRef(headerCellRef, ref);
  let ariaSort = 'none';

  if (sortDirection != null) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  React.useEffect(() => {
    if (!showColumnMenuIcon) {
      setShowColumnMenuIcon(columnMenuOpen);
    }
  }, [showColumnMenuIcon, columnMenuOpen]);
  React.useLayoutEffect(() => {
    const columnMenuState = apiRef.current.state.columnMenu;

    if (hasFocus && !columnMenuState.open) {
      const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
      const elementToFocus = focusableElement || headerCellRef.current;
      elementToFocus?.focus();
      apiRef.current.columnHeadersContainerElementRef.current.scrollLeft = 0;
    }
  }, [apiRef, hasFocus]);
  return /*#__PURE__*/_jsxs("div", _extends({
    ref: handleRef,
    className: clsx(classes.root, headerClassName),
    style: {
      height,
      width,
      minWidth: width,
      maxWidth: width
    },
    role: "columnheader",
    tabIndex: tabIndex,
    "aria-colindex": colIndex + 1,
    "aria-sort": ariaSort,
    "aria-label": headerComponent == null ? label : undefined
  }, other, {
    children: [/*#__PURE__*/_jsxs("div", _extends({
      className: classes.draggableContainer,
      draggable: isDraggable
    }, draggableContainerProps, {
      children: [/*#__PURE__*/_jsxs("div", {
        className: classes.titleContainer,
        children: [/*#__PURE__*/_jsx("div", {
          className: classes.titleContainerContent,
          children: headerComponent !== undefined ? headerComponent : /*#__PURE__*/_jsx(GridColumnHeaderTitle, {
            label: label,
            description: description,
            columnWidth: width
          })
        }), columnTitleIconButtons]
      }), columnMenuIconButton]
    })), !disableHeaderSeparator && /*#__PURE__*/_jsx(GridColumnHeaderSeparator, _extends({
      resizable: !rootProps.disableColumnResize && !!resizable,
      resizing: isResizing,
      height: height,
      side: separatorSide
    }, columnHeaderSeparatorProps)), columnMenu]
  }));
});
export { GridGenericColumnHeaderItem };