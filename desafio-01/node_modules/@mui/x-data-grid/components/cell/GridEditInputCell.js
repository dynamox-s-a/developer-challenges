import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "getValue", "isValidating", "debounceMs", "isProcessingProps", "onValueChange"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridLoadIcon } from '../icons/index';
import { SUBMIT_FILTER_STROKE_TIME } from '../panel/filterPanel/GridFilterInputValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { jsx as _jsx } from "react/jsx-runtime";

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['editInputCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditInputCellRoot = styled(InputBase, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
  overridesResolver: (props, styles) => styles.editInputCell
})(({
  theme
}) => _extends({}, theme.typography.body2, {
  padding: '1px 0',
  '& input': {
    padding: '0 16px',
    height: '100%'
  }
}));
const GridEditInputCell = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _rootProps$experiment, _rootProps$experiment3;

  const rootProps = useGridRootProps();

  const {
    id,
    value,
    field,
    colDef,
    hasFocus,
    debounceMs = (_rootProps$experiment = rootProps.experimentalFeatures) != null && _rootProps$experiment.newEditingApi ? 200 : SUBMIT_FILTER_STROKE_TIME,
    isProcessingProps,
    onValueChange
  } = props,
        other = _objectWithoutPropertiesLoose(props, _excluded);

  const apiRef = useGridApiContext();
  const inputRef = React.useRef();
  const [valueState, setValueState] = React.useState(value);
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const handleChange = React.useCallback(async event => {
    var _rootProps$experiment2;

    const newValue = event.target.value;

    if (onValueChange) {
      await onValueChange(event, newValue);
    }

    const column = apiRef.current.getColumn(field);
    let parsedValue = newValue;

    if (column.valueParser && (_rootProps$experiment2 = rootProps.experimentalFeatures) != null && _rootProps$experiment2.newEditingApi) {
      parsedValue = column.valueParser(newValue, apiRef.current.getCellParams(id, field));
    }

    setValueState(parsedValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: parsedValue,
      debounceMs,
      unstable_skipValueParser: true
    }, event);
  }, [apiRef, debounceMs, field, id, onValueChange, (_rootProps$experiment3 = rootProps.experimentalFeatures) == null ? void 0 : _rootProps$experiment3.newEditingApi]);
  const meta = apiRef.current.unstable_getEditCellMeta ? apiRef.current.unstable_getEditCellMeta(id, field) : {};
  React.useEffect(() => {
    if (meta.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta.changeReason, value]);
  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/_jsx(GridEditInputCellRoot, _extends({
    ref: ref,
    inputRef: inputRef,
    className: classes.root,
    fullWidth: true,
    type: colDef.type === 'number' ? colDef.type : 'text',
    value: valueState != null ? valueState : '',
    onChange: handleChange,
    endAdornment: isProcessingProps ? /*#__PURE__*/_jsx(GridLoadIcon, {}) : undefined
  }, other));
});
process.env.NODE_ENV !== "production" ? GridEditInputCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: PropTypes.any,

  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']),
  changeReason: PropTypes.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object,
  debounceMs: PropTypes.number,

  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string,

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
  getValue: PropTypes.func,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool,

  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  isProcessingProps: PropTypes.bool,
  isValidating: PropTypes.bool,

  /**
   * Callback called when the value is changed by the user.
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: PropTypes.func,

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object,

  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]),

  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridEditInputCell };
export const renderEditInputCell = params => /*#__PURE__*/_jsx(GridEditInputCell, _extends({}, params));