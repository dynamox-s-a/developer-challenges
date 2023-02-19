import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["item", "applyValue", "apiRef", "focusElementRef"];
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export function GridFilterInputBoolean(props) {
  const {
    item,
    applyValue,
    apiRef,
    focusElementRef
  } = props,
        others = _objectWithoutPropertiesLoose(props, _excluded);

  const [filterValueState, setFilterValueState] = React.useState(item.value || '');
  const rootProps = useGridRootProps();
  const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;
  const OptionComponent = isSelectNative ? 'option' : MenuItem;
  const onFilterChange = React.useCallback(event => {
    const value = event.target.value;
    setFilterValueState(value);
    applyValue(_extends({}, item, {
      value
    }));
  }, [applyValue, item]);
  React.useEffect(() => {
    setFilterValueState(item.value || '');
  }, [item.value]);
  return /*#__PURE__*/_jsxs(rootProps.components.BaseTextField, _extends({
    label: apiRef.current.getLocaleText('filterPanelInputLabel'),
    value: filterValueState,
    onChange: onFilterChange,
    select: true,
    variant: "standard",
    SelectProps: _extends({
      native: isSelectNative,
      displayEmpty: true
    }, rootProps.componentsProps?.baseSelect),
    InputLabelProps: {
      shrink: true
    },
    inputRef: focusElementRef
  }, others, rootProps.componentsProps?.baseTextField, {
    children: [/*#__PURE__*/_jsx(OptionComponent, {
      value: "",
      children: apiRef.current.getLocaleText('filterValueAny')
    }), /*#__PURE__*/_jsx(OptionComponent, {
      value: "true",
      children: apiRef.current.getLocaleText('filterValueTrue')
    }), /*#__PURE__*/_jsx(OptionComponent, {
      value: "false",
      children: apiRef.current.getLocaleText('filterValueFalse')
    })]
  }));
}