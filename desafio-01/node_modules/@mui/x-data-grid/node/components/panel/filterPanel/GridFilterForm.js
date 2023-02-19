"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridFilterForm = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _material = require("@mui/material");

var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));

var _MenuItem = _interopRequireDefault(require("@mui/material/MenuItem"));

var _InputLabel = _interopRequireDefault(require("@mui/material/InputLabel"));

var _FormControl = _interopRequireDefault(require("@mui/material/FormControl"));

var _utils = require("@mui/material/utils");

var _styles = require("@mui/material/styles");

var _clsx = _interopRequireDefault(require("clsx"));

var _gridColumnsSelector = require("../../../hooks/features/columns/gridColumnsSelector");

var _useGridSelector = require("../../../hooks/utils/useGridSelector");

var _gridFilterItem = require("../../../models/gridFilterItem");

var _useGridApiContext = require("../../../hooks/utils/useGridApiContext");

var _useGridRootProps = require("../../../hooks/utils/useGridRootProps");

var _gridClasses = require("../../../constants/gridClasses");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["item", "hasMultipleFilters", "deleteFilter", "applyFilterChanges", "multiFilterOperator", "showMultiFilterOperators", "disableMultiFilterOperator", "applyMultiFilterOperatorChanges", "focusElementRef", "linkOperators", "columnsSort", "deleteIconProps", "linkOperatorInputProps", "operatorInputProps", "columnInputProps", "valueInputProps", "children"],
      _excluded2 = ["InputComponentProps"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['filterForm'],
    deleteIcon: ['filterFormDeleteIcon'],
    linkOperatorInput: ['filterFormLinkOperatorInput'],
    columnInput: ['filterFormColumnInput'],
    operatorInput: ['filterFormOperatorInput'],
    valueInput: ['filterFormValueInput']
  };
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
};

const GridFilterFormRoot = (0, _styles.styled)('div', {
  name: 'MuiDataGrid',
  slot: 'FilterForm',
  overridesResolver: (props, styles) => styles.filterForm
})(({
  theme
}) => ({
  display: 'flex',
  padding: theme.spacing(1)
}));
const FilterFormDeleteIcon = (0, _styles.styled)(_FormControl.default, {
  name: 'MuiDataGrid',
  slot: 'FilterFormDeleteIcon',
  overridesResolver: (_, styles) => styles.filterFormDeleteIcon
})(({
  theme
}) => ({
  flexShrink: 0,
  justifyContent: 'flex-end',
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.2)
}));
const FilterFormLinkOperatorInput = (0, _styles.styled)(_FormControl.default, {
  name: 'MuiDataGrid',
  slot: 'FilterFormLinkOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormLinkOperatorInput
})({
  minWidth: 55,
  marginRight: 5,
  justifyContent: 'end'
});
const FilterFormColumnInput = (0, _styles.styled)(_FormControl.default, {
  name: 'MuiDataGrid',
  slot: 'FilterFormColumnInput',
  overridesResolver: (_, styles) => styles.filterFormColumnInput
})({
  width: 150
});
const FilterFormOperatorInput = (0, _styles.styled)(_FormControl.default, {
  name: 'MuiDataGrid',
  slot: 'FilterFormOperatorInput',
  overridesResolver: (_, styles) => styles.filterFormOperatorInput
})({
  width: 120
});
const FilterFormValueInput = (0, _styles.styled)(_FormControl.default, {
  name: 'MuiDataGrid',
  slot: 'FilterFormValueInput',
  overridesResolver: (_, styles) => styles.filterFormValueInput
})({
  width: 190
});

const getLinkOperatorLocaleKey = linkOperator => {
  switch (linkOperator) {
    case _gridFilterItem.GridLinkOperator.And:
      return 'filterPanelOperatorAnd';

    case _gridFilterItem.GridLinkOperator.Or:
      return 'filterPanelOperatorOr';

    default:
      throw new Error('MUI: Invalid `linkOperator` property in the `GridFilterPanel`.');
  }
};

const getColumnLabel = col => col.headerName || col.field;

const collator = new Intl.Collator();
const GridFilterForm = /*#__PURE__*/React.forwardRef(function GridFilterForm(props, ref) {
  var _rootProps$components, _rootProps$components2, _baseSelectProps$nati, _rootProps$components3, _rootProps$components4, _rootProps$components5, _currentColumn$filter2;

  const {
    item,
    hasMultipleFilters,
    deleteFilter,
    applyFilterChanges,
    multiFilterOperator,
    showMultiFilterOperators,
    disableMultiFilterOperator,
    applyMultiFilterOperatorChanges,
    focusElementRef,
    linkOperators = [_gridFilterItem.GridLinkOperator.And, _gridFilterItem.GridLinkOperator.Or],
    columnsSort,
    deleteIconProps = {},
    linkOperatorInputProps = {},
    operatorInputProps = {},
    columnInputProps = {},
    valueInputProps = {}
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const filterableColumns = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnsSelector.gridFilterableColumnDefinitionsSelector);
  const columnSelectId = (0, _utils.unstable_useId)();
  const columnSelectLabelId = (0, _utils.unstable_useId)();
  const operatorSelectId = (0, _utils.unstable_useId)();
  const operatorSelectLabelId = (0, _utils.unstable_useId)();
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const valueRef = React.useRef(null);
  const filterSelectorRef = React.useRef(null);
  const hasLinkOperatorColumn = hasMultipleFilters && linkOperators.length > 0;
  const baseFormControlProps = ((_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.baseFormControl) || {};
  const baseSelectProps = ((_rootProps$components2 = rootProps.componentsProps) == null ? void 0 : _rootProps$components2.baseSelect) || {};
  const isBaseSelectNative = (_baseSelectProps$nati = baseSelectProps.native) != null ? _baseSelectProps$nati : true;
  const OptionComponent = isBaseSelectNative ? 'option' : _MenuItem.default;
  const {
    InputComponentProps
  } = valueInputProps,
        valueInputPropsOther = (0, _objectWithoutPropertiesLoose2.default)(valueInputProps, _excluded2);
  const sortedFilterableColumns = React.useMemo(() => {
    switch (columnsSort) {
      case 'asc':
        return filterableColumns.sort((a, b) => collator.compare(getColumnLabel(a), getColumnLabel(b)));

      case 'desc':
        return filterableColumns.sort((a, b) => -collator.compare(getColumnLabel(a), getColumnLabel(b)));

      default:
        return filterableColumns;
    }
  }, [filterableColumns, columnsSort]);
  const currentColumn = item.columnField ? apiRef.current.getColumn(item.columnField) : null;
  const currentOperator = React.useMemo(() => {
    var _currentColumn$filter;

    if (!item.operatorValue || !currentColumn) {
      return null;
    }

    return (_currentColumn$filter = currentColumn.filterOperators) == null ? void 0 : _currentColumn$filter.find(operator => operator.value === item.operatorValue);
  }, [item, currentColumn]);
  const changeColumn = React.useCallback(event => {
    const columnField = event.target.value;
    const column = apiRef.current.getColumn(columnField);

    if (column.field === currentColumn.field) {
      // column did not change
      return;
    } // try to keep the same operator when column change


    const newOperator = column.filterOperators.find(operator => operator.value === item.operatorValue) || column.filterOperators[0]; // Erase filter value if the input component is modified

    const eraseItemValue = !newOperator.InputComponent || newOperator.InputComponent !== (currentOperator == null ? void 0 : currentOperator.InputComponent);
    applyFilterChanges((0, _extends2.default)({}, item, {
      columnField,
      operatorValue: newOperator.value,
      value: eraseItemValue ? undefined : item.value
    }));
  }, [apiRef, applyFilterChanges, item, currentColumn, currentOperator]);
  const changeOperator = React.useCallback(event => {
    const operatorValue = event.target.value;
    const newOperator = currentColumn == null ? void 0 : currentColumn.filterOperators.find(operator => operator.value === operatorValue);
    const eraseItemValue = !(newOperator != null && newOperator.InputComponent) || (newOperator == null ? void 0 : newOperator.InputComponent) !== (currentOperator == null ? void 0 : currentOperator.InputComponent);
    applyFilterChanges((0, _extends2.default)({}, item, {
      operatorValue,
      value: eraseItemValue ? undefined : item.value
    }));
  }, [applyFilterChanges, item, currentColumn, currentOperator]);
  const changeLinkOperator = React.useCallback(event => {
    const linkOperator = event.target.value === _gridFilterItem.GridLinkOperator.And.toString() ? _gridFilterItem.GridLinkOperator.And : _gridFilterItem.GridLinkOperator.Or;
    applyMultiFilterOperatorChanges(linkOperator);
  }, [applyMultiFilterOperatorChanges]);

  const handleDeleteFilter = () => {
    if (rootProps.disableMultipleColumnsFiltering) {
      if (item.value === undefined) {
        deleteFilter(item);
      } else {
        // TODO v6: simplify the behavior by always remove the filter form
        applyFilterChanges((0, _extends2.default)({}, item, {
          value: undefined
        }));
      }
    } else {
      deleteFilter(item);
    }
  };

  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      if (currentOperator != null && currentOperator.InputComponent) {
        var _valueRef$current;

        valueRef == null ? void 0 : (_valueRef$current = valueRef.current) == null ? void 0 : _valueRef$current.focus();
      } else {
        filterSelectorRef.current.focus();
      }
    }
  }), [currentOperator]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(GridFilterFormRoot, (0, _extends2.default)({
    ref: ref,
    className: classes.root
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(FilterFormDeleteIcon, (0, _extends2.default)({
      variant: "standard",
      as: rootProps.components.BaseFormControl
    }, baseFormControlProps, deleteIconProps, {
      className: (0, _clsx.default)(classes.deleteIcon, baseFormControlProps.className, deleteIconProps.className),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        "aria-label": apiRef.current.getLocaleText('filterPanelDeleteIconLabel'),
        title: apiRef.current.getLocaleText('filterPanelDeleteIconLabel'),
        onClick: handleDeleteFilter,
        size: "small",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.FilterPanelDeleteIcon, {
          fontSize: "small"
        })
      })
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(FilterFormLinkOperatorInput, (0, _extends2.default)({
      variant: "standard",
      as: rootProps.components.BaseFormControl
    }, baseFormControlProps, linkOperatorInputProps, {
      sx: (0, _extends2.default)({
        display: hasLinkOperatorColumn ? 'flex' : 'none',
        visibility: showMultiFilterOperators ? 'visible' : 'hidden'
      }, baseFormControlProps.sx || {}, linkOperatorInputProps.sx || {}),
      className: (0, _clsx.default)(classes.linkOperatorInput, baseFormControlProps.className, linkOperatorInputProps.className),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.BaseSelect, (0, _extends2.default)({
        inputProps: {
          'aria-label': apiRef.current.getLocaleText('filterPanelLinkOperator')
        },
        value: multiFilterOperator,
        onChange: changeLinkOperator,
        disabled: !!disableMultiFilterOperator || linkOperators.length === 1,
        native: isBaseSelectNative
      }, (_rootProps$components3 = rootProps.componentsProps) == null ? void 0 : _rootProps$components3.baseSelect, {
        children: linkOperators.map(linkOperator => /*#__PURE__*/(0, _jsxRuntime.jsx)(OptionComponent, {
          value: linkOperator.toString(),
          children: apiRef.current.getLocaleText(getLinkOperatorLocaleKey(linkOperator))
        }, linkOperator.toString()))
      }))
    })), /*#__PURE__*/(0, _jsxRuntime.jsxs)(FilterFormColumnInput, (0, _extends2.default)({
      variant: "standard",
      as: rootProps.components.BaseFormControl
    }, baseFormControlProps, columnInputProps, {
      className: (0, _clsx.default)(classes.columnInput, baseFormControlProps.className, columnInputProps.className),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_InputLabel.default, {
        htmlFor: columnSelectId,
        id: columnSelectLabelId,
        children: apiRef.current.getLocaleText('filterPanelColumns')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.BaseSelect, (0, _extends2.default)({
        labelId: columnSelectLabelId,
        id: columnSelectId,
        label: apiRef.current.getLocaleText('filterPanelColumns'),
        value: item.columnField || '',
        onChange: changeColumn,
        native: isBaseSelectNative
      }, (_rootProps$components4 = rootProps.componentsProps) == null ? void 0 : _rootProps$components4.baseSelect, {
        children: sortedFilterableColumns.map(col => /*#__PURE__*/(0, _jsxRuntime.jsx)(OptionComponent, {
          value: col.field,
          children: getColumnLabel(col)
        }, col.field))
      }))]
    })), /*#__PURE__*/(0, _jsxRuntime.jsxs)(FilterFormOperatorInput, (0, _extends2.default)({
      variant: "standard",
      as: rootProps.components.BaseFormControl
    }, baseFormControlProps, operatorInputProps, {
      className: (0, _clsx.default)(classes.operatorInput, baseFormControlProps.className, operatorInputProps.className),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_InputLabel.default, {
        htmlFor: operatorSelectId,
        id: operatorSelectLabelId,
        children: apiRef.current.getLocaleText('filterPanelOperators')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.BaseSelect, (0, _extends2.default)({
        labelId: operatorSelectLabelId,
        label: apiRef.current.getLocaleText('filterPanelOperators'),
        id: operatorSelectId,
        value: item.operatorValue,
        onChange: changeOperator,
        native: isBaseSelectNative,
        inputRef: filterSelectorRef
      }, (_rootProps$components5 = rootProps.componentsProps) == null ? void 0 : _rootProps$components5.baseSelect, {
        children: currentColumn == null ? void 0 : (_currentColumn$filter2 = currentColumn.filterOperators) == null ? void 0 : _currentColumn$filter2.map(operator => /*#__PURE__*/(0, _jsxRuntime.jsx)(OptionComponent, {
          value: operator.value,
          children: operator.label || apiRef.current.getLocaleText(`filterOperator${(0, _utils.capitalize)(operator.value)}`)
        }, operator.value))
      }))]
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(FilterFormValueInput, (0, _extends2.default)({
      variant: "standard",
      as: rootProps.components.BaseFormControl
    }, baseFormControlProps, valueInputPropsOther, {
      className: (0, _clsx.default)(classes.valueInput, baseFormControlProps.className, valueInputPropsOther.className),
      children: currentOperator != null && currentOperator.InputComponent ? /*#__PURE__*/(0, _jsxRuntime.jsx)(currentOperator.InputComponent, (0, _extends2.default)({
        apiRef: apiRef,
        item: item,
        applyValue: applyFilterChanges,
        focusElementRef: valueRef
      }, currentOperator.InputComponentProps, InputComponentProps)) : null
    }))]
  }));
});
exports.GridFilterForm = GridFilterForm;
process.env.NODE_ENV !== "production" ? GridFilterForm.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------

  /**
   * Callback called when the operator, column field or value is changed.
   * @param {GridFilterItem} item The updated [[GridFilterItem]].
   */
  applyFilterChanges: _propTypes.default.func.isRequired,

  /**
   * Callback called when the logic operator is changed.
   * @param {GridLinkOperator} operator The new logic operator.
   */
  applyMultiFilterOperatorChanges: _propTypes.default.func.isRequired,

  /**
   * @ignore - do not document.
   */
  children: _propTypes.default.node,

  /**
   * Props passed to the column input component.
   * @default {}
   */
  columnInputProps: _propTypes.default.any,

  /**
   * Changes how the options in the columns selector should be ordered.
   * If not specified, the order is derived from the `columns` prop.
   */
  columnsSort: _propTypes.default.oneOf(['asc', 'desc']),

  /**
   * Callback called when the delete button is clicked.
   * @param {GridFilterItem} item The deleted [[GridFilterItem]].
   */
  deleteFilter: _propTypes.default.func.isRequired,

  /**
   * Props passed to the delete icon.
   * @default {}
   */
  deleteIconProps: _propTypes.default.any,

  /**
   * If `true`, disables the logic operator field but still renders it.
   */
  disableMultiFilterOperator: _propTypes.default.bool,

  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the el
   */
  focusElementRef: _propTypes.default
  /* @typescript-to-proptypes-ignore */
  .oneOfType([_propTypes.default.func, _propTypes.default.object]),

  /**
   * If `true`, the logic operator field is rendered.
   * The field will be invisible if `showMultiFilterOperators` is also `true`.
   */
  hasMultipleFilters: _propTypes.default.bool.isRequired,

  /**
   * The [[GridFilterItem]] representing this form.
   */
  item: _propTypes.default.shape({
    columnField: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operatorValue: _propTypes.default.string,
    value: _propTypes.default.any
  }).isRequired,

  /**
   * Props passed to the logic operator input component.
   * @default {}
   */
  linkOperatorInputProps: _propTypes.default.any,

  /**
   * Sets the available logic operators.
   * @default [GridLinkOperator.And, GridLinkOperator.Or]
   */
  linkOperators: _propTypes.default.arrayOf(_propTypes.default.oneOf(['and', 'or']).isRequired),

  /**
   * The current logic operator applied.
   */
  multiFilterOperator: _propTypes.default.oneOf(['and', 'or']),

  /**
   * Props passed to the operator input component.
   * @default {}
   */
  operatorInputProps: _propTypes.default.any,

  /**
   * If `true`, the logic operator field is visible.
   */
  showMultiFilterOperators: _propTypes.default.bool,

  /**
   * Props passed to the value input component.
   * @default {}
   */
  valueInputProps: _propTypes.default.any
} : void 0;