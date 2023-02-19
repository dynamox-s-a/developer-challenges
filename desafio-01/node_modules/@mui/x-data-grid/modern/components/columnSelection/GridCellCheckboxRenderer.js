import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["field", "id", "value", "formattedValue", "row", "rowNode", "colDef", "isEditable", "cellMode", "hasFocus", "tabIndex", "getValue", "api"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useForkRef } from '@mui/material/utils';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { jsx as _jsx } from "react/jsx-runtime";

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['checkboxInput']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridCellCheckboxForwardRef = /*#__PURE__*/React.forwardRef(function GridCellCheckboxRenderer(props, ref) {
  const {
    field,
    id,
    value: isChecked,
    rowNode,
    hasFocus,
    tabIndex
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const checkboxElement = React.useRef(null);
  const rippleRef = React.useRef();
  const handleRef = useForkRef(checkboxElement, ref);
  const element = apiRef.current.getCellElement(id, field);

  const handleChange = event => {
    const params = {
      value: event.target.checked,
      id
    };
    apiRef.current.publishEvent('rowSelectionCheckboxChange', params, event);
  };

  React.useLayoutEffect(() => {
    if (tabIndex === 0 && element) {
      element.tabIndex = -1;
    }
  }, [element, tabIndex]);
  React.useEffect(() => {
    if (hasFocus) {
      const input = checkboxElement.current?.querySelector('input');
      input?.focus({
        preventScroll: true
      });
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);
  const handleKeyDown = React.useCallback(event => {
    if (isSpaceKey(event.key)) {
      event.stopPropagation();
    }

    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent('cellNavigationKeyDown', props, event);
    }
  }, [apiRef, props]);

  if (rowNode.position === 'footer') {
    return null;
  }

  const isSelectable = apiRef.current.isRowSelectable(id);
  const label = apiRef.current.getLocaleText(isChecked ? 'checkboxSelectionUnselectRow' : 'checkboxSelectionSelectRow');

  if (rowNode.isPinned) {
    return null;
  }

  return /*#__PURE__*/_jsx(rootProps.components.BaseCheckbox, _extends({
    ref: handleRef,
    tabIndex: tabIndex,
    checked: isChecked,
    onChange: handleChange,
    className: classes.root,
    inputProps: {
      'aria-label': label
    },
    onKeyDown: handleKeyDown,
    disabled: !isSelectable,
    touchRippleRef: rippleRef
  }, rootProps.componentsProps?.baseCheckbox, other));
});
process.env.NODE_ENV !== "production" ? GridCellCheckboxForwardRef.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: PropTypes.any.isRequired,

  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,

  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,

  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      focus: PropTypes.func.isRequired
    })
  })]),

  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,

  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: PropTypes.func.isRequired,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,

  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,

  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,

  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridCellCheckboxForwardRef };
export const GridCellCheckboxRenderer = GridCellCheckboxForwardRef;