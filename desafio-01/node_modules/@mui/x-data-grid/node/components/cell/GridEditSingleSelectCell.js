"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridEditSingleSelectCell = GridEditSingleSelectCell;
exports.renderEditSingleSelectCell = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("@mui/material/utils");

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _keyboardUtils = require("../../utils/keyboardUtils");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _gridEditRowModel = require("../../models/gridEditRowModel");

var _filterPanelUtils = require("../panel/filterPanel/filterPanelUtils");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "tabIndex", "className", "getValue", "hasFocus", "isValidating", "isProcessingProps", "error", "onValueChange", "initialOpen"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const renderSingleSelectOptions = (option, OptionComponent) => {
  const isOptionTypeObject = typeof option === 'object';
  const key = isOptionTypeObject ? option.value : option;
  const value = isOptionTypeObject ? option.value : option;
  const content = isOptionTypeObject ? option.label : option;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(OptionComponent, {
    value: value,
    children: content
  }, key);
};

function isKeyboardEvent(event) {
  return !!event.key;
}

function GridEditSingleSelectCell(props) {
  var _rootProps$components, _baseSelectProps$nati, _rootProps$components2;

  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const {
    id,
    value,
    api,
    field,
    row,
    colDef,
    hasFocus,
    error,
    onValueChange,
    initialOpen = rootProps.editMode === _gridEditRowModel.GridEditModes.Cell
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const ref = React.useRef();
  const inputRef = React.useRef();
  const [open, setOpen] = React.useState(initialOpen);
  const baseSelectProps = ((_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.baseSelect) || {};
  const isSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : false;
  let valueOptionsFormatted;

  if (typeof colDef.valueOptions === 'function') {
    valueOptionsFormatted = colDef.valueOptions({
      id,
      row,
      field
    });
  } else {
    valueOptionsFormatted = colDef.valueOptions;
  }

  if (colDef.valueFormatter) {
    valueOptionsFormatted = valueOptionsFormatted.map(option => {
      if (typeof option === 'object') {
        return option;
      }

      const params = {
        field,
        api,
        value: option
      };
      return {
        value: option,
        label: String(colDef.valueFormatter(params))
      };
    });
  }

  const handleChange = async event => {
    var _rootProps$experiment;

    setOpen(false);
    const target = event.target; // NativeSelect casts the value to a string.

    const formattedTargetValue = (0, _filterPanelUtils.getValueFromValueOptions)(target.value, valueOptionsFormatted);

    if (onValueChange) {
      await onValueChange(event, formattedTargetValue);
    }

    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: formattedTargetValue
    }, event);

    if ((_rootProps$experiment = rootProps.experimentalFeatures) != null && _rootProps$experiment.newEditingApi) {
      return;
    } // We use isValid === false because the default return is undefined which evaluates to true with !isValid


    if (rootProps.editMode === _gridEditRowModel.GridEditModes.Row || isValid === false) {
      return;
    }

    const canCommit = await Promise.resolve(apiRef.current.commitCellChange({
      id,
      field
    }, event));

    if (canCommit) {
      apiRef.current.setCellMode(id, field, 'view');

      if (event.key) {
        // TODO v6: remove once we stop ignoring events fired from portals
        const params = apiRef.current.getCellParams(id, field);
        apiRef.current.publishEvent('cellNavigationKeyDown', params, event);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (rootProps.editMode === _gridEditRowModel.GridEditModes.Row) {
      setOpen(false);
      return;
    }

    if (reason === 'backdropClick' || (0, _keyboardUtils.isEscapeKey)(event.key)) {
      var _rootProps$experiment2;

      if ((_rootProps$experiment2 = rootProps.experimentalFeatures) != null && _rootProps$experiment2.newEditingApi) {
        apiRef.current.stopCellEditMode({
          id,
          field,
          ignoreModifications: true
        });
      } else {
        apiRef.current.setCellMode(id, field, 'view');
      }
    }
  };

  const handleOpen = event => {
    if (isKeyboardEvent(event) && event.key === 'Enter') {
      return;
    }

    setOpen(true);
  };

  (0, _utils.unstable_useEnhancedEffect)(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.BaseSelect, (0, _extends2.default)({
    ref: ref,
    inputRef: inputRef,
    value: value,
    onChange: handleChange,
    open: open,
    onOpen: handleOpen,
    MenuProps: {
      onClose: handleClose
    },
    error: error,
    native: isSelectNative,
    fullWidth: true
  }, other, (_rootProps$components2 = rootProps.componentsProps) == null ? void 0 : _rootProps$components2.baseSelect, {
    children: valueOptionsFormatted.map(valueOptions => renderSingleSelectOptions(valueOptions, isSelectNative ? 'option' : _MenuItem.default))
  }));
}

process.env.NODE_ENV !== "production" ? GridEditSingleSelectCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: _propTypes.default.any.isRequired,

  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,
  changeReason: _propTypes.default.oneOf(['debouncedSetEditCellValue', 'setEditCellValue']),

  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,

  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,

  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,

  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: _propTypes.default.func.isRequired,

  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,

  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,

  /**
   * If true, the select opens by default.
   */
  initialOpen: _propTypes.default.bool,

  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  isProcessingProps: _propTypes.default.bool,
  isValidating: _propTypes.default.bool,

  /**
   * Callback called when the value is changed by the user.
   * @param {SelectChangeEvent<any>} event The event source of the callback.
   * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
   * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
   */
  onValueChange: _propTypes.default.func,

  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any.isRequired,

  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,

  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,

  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: _propTypes.default.any
} : void 0;

const renderEditSingleSelectCell = params => /*#__PURE__*/(0, _jsxRuntime.jsx)(GridEditSingleSelectCell, (0, _extends2.default)({}, params));

exports.renderEditSingleSelectCell = renderEditSingleSelectCell;