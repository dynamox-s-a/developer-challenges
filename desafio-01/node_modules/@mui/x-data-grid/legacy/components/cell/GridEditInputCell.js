import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "hasFocus", "getValue", "isValidating", "debounceMs", "isProcessingProps", "onValueChange"];
import _regeneratorRuntime from "@babel/runtime/regenerator";
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

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['editInputCell']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

var GridEditInputCellRoot = styled(InputBase, {
  name: 'MuiDataGrid',
  slot: 'EditInputCell',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.editInputCell;
  }
})(function (_ref) {
  var theme = _ref.theme;
  return _extends({}, theme.typography.body2, {
    padding: '1px 0',
    '& input': {
      padding: '0 16px',
      height: '100%'
    }
  });
});
var GridEditInputCell = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _rootProps$experiment, _rootProps$experiment3;

  var rootProps = useGridRootProps();

  var id = props.id,
      value = props.value,
      formattedValue = props.formattedValue,
      api = props.api,
      field = props.field,
      row = props.row,
      rowNode = props.rowNode,
      colDef = props.colDef,
      cellMode = props.cellMode,
      isEditable = props.isEditable,
      tabIndex = props.tabIndex,
      hasFocus = props.hasFocus,
      getValue = props.getValue,
      isValidating = props.isValidating,
      _props$debounceMs = props.debounceMs,
      debounceMs = _props$debounceMs === void 0 ? (_rootProps$experiment = rootProps.experimentalFeatures) != null && _rootProps$experiment.newEditingApi ? 200 : SUBMIT_FILTER_STROKE_TIME : _props$debounceMs,
      isProcessingProps = props.isProcessingProps,
      onValueChange = props.onValueChange,
      other = _objectWithoutProperties(props, _excluded);

  var apiRef = useGridApiContext();
  var inputRef = React.useRef();

  var _React$useState = React.useState(value),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      valueState = _React$useState2[0],
      setValueState = _React$useState2[1];

  var ownerState = {
    classes: rootProps.classes
  };
  var classes = useUtilityClasses(ownerState);
  var handleChange = React.useCallback( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
      var _rootProps$experiment2;

      var newValue, column, parsedValue;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              newValue = event.target.value;

              if (!onValueChange) {
                _context.next = 4;
                break;
              }

              _context.next = 4;
              return onValueChange(event, newValue);

            case 4:
              column = apiRef.current.getColumn(field);
              parsedValue = newValue;

              if (column.valueParser && (_rootProps$experiment2 = rootProps.experimentalFeatures) != null && _rootProps$experiment2.newEditingApi) {
                parsedValue = column.valueParser(newValue, apiRef.current.getCellParams(id, field));
              }

              setValueState(parsedValue);
              apiRef.current.setEditCellValue({
                id: id,
                field: field,
                value: parsedValue,
                debounceMs: debounceMs,
                unstable_skipValueParser: true
              }, event);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), [apiRef, debounceMs, field, id, onValueChange, (_rootProps$experiment3 = rootProps.experimentalFeatures) == null ? void 0 : _rootProps$experiment3.newEditingApi]);
  var meta = apiRef.current.unstable_getEditCellMeta ? apiRef.current.unstable_getEditCellMeta(id, field) : {};
  React.useEffect(function () {
    if (meta.changeReason !== 'debouncedSetEditCellValue') {
      setValueState(value);
    }
  }, [meta.changeReason, value]);
  useEnhancedEffect(function () {
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
export var renderEditInputCell = function renderEditInputCell(params) {
  return /*#__PURE__*/_jsx(GridEditInputCell, _extends({}, params));
};