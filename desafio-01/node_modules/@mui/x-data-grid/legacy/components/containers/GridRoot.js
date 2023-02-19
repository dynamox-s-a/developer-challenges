import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["children", "className"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useForkRef, unstable_useEnhancedEffect as useEnhancedEffect, capitalize } from '@mui/material/utils';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridRootStyles } from './GridRootStyles';
import { gridVisibleColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridDensityHeaderGroupingMaxDepthSelector, gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { gridPinnedRowsCountSelector, gridRowCountSelector } from '../../hooks/features/rows/gridRowsSelector';
import { jsx as _jsx } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var autoHeight = ownerState.autoHeight,
      density = ownerState.density,
      classes = ownerState.classes;
  var slots = {
    root: ['root', autoHeight && 'autoHeight', "root--density".concat(capitalize(density))]
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

var GridRoot = /*#__PURE__*/React.forwardRef(function GridRoot(props, ref) {
  var rootProps = useGridRootProps();

  var children = props.children,
      className = props.className,
      other = _objectWithoutProperties(props, _excluded);

  var apiRef = useGridApiContext();
  var visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  var totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  var densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  var headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  var rootContainerRef = React.useRef(null);
  var handleRef = useForkRef(rootContainerRef, ref);
  var pinnedRowsCount = useGridSelector(apiRef, gridPinnedRowsCountSelector);
  var ownerState = {
    density: densityValue,
    classes: rootProps.classes,
    autoHeight: rootProps.autoHeight
  };
  var classes = useUtilityClasses(ownerState);
  apiRef.current.rootElementRef = rootContainerRef; // Our implementation of <NoSsr />

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      mountedState = _React$useState2[0],
      setMountedState = _React$useState2[1];

  useEnhancedEffect(function () {
    setMountedState(true);
  }, []);
  useEnhancedEffect(function () {
    if (mountedState) {
      apiRef.current.unstable_updateGridDimensionsRef();
    }
  }, [apiRef, mountedState]);

  if (!mountedState) {
    return null;
  }

  return /*#__PURE__*/_jsx(GridRootStyles, _extends({
    ref: handleRef,
    className: clsx(className, classes.root),
    role: "grid",
    "aria-colcount": visibleColumns.length,
    "aria-rowcount": headerGroupingMaxDepth + 1 + pinnedRowsCount + totalRowCount,
    "aria-multiselectable": !rootProps.disableMultipleSelection,
    "aria-label": rootProps['aria-label'],
    "aria-labelledby": rootProps['aria-labelledby']
  }, other, {
    children: children
  }));
});
process.env.NODE_ENV !== "production" ? GridRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { GridRoot };