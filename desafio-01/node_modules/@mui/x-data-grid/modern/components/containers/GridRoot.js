import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["children", "className"];
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

const useUtilityClasses = ownerState => {
  const {
    autoHeight,
    density,
    classes
  } = ownerState;
  const slots = {
    root: ['root', autoHeight && 'autoHeight', `root--density${capitalize(density)}`]
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRoot = /*#__PURE__*/React.forwardRef(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();

  const {
    children,
    className
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const apiRef = useGridApiContext();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridDensityHeaderGroupingMaxDepthSelector);
  const rootContainerRef = React.useRef(null);
  const handleRef = useForkRef(rootContainerRef, ref);
  const pinnedRowsCount = useGridSelector(apiRef, gridPinnedRowsCountSelector);
  const ownerState = {
    density: densityValue,
    classes: rootProps.classes,
    autoHeight: rootProps.autoHeight
  };
  const classes = useUtilityClasses(ownerState);
  apiRef.current.rootElementRef = rootContainerRef; // Our implementation of <NoSsr />

  const [mountedState, setMountedState] = React.useState(false);
  useEnhancedEffect(() => {
    setMountedState(true);
  }, []);
  useEnhancedEffect(() => {
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