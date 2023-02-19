import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["innerRef", "className"];
import * as React from 'react';
import { useGridColumnHeaders } from '../hooks/features/columnHeaders/useGridColumnHeaders';
import { GridScrollArea } from './GridScrollArea';
import { GridColumnHeaders } from './columnHeaders/GridColumnHeaders';
import { GridColumnHeadersInner } from './columnHeaders/GridColumnHeadersInner';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export var DataGridColumnHeaders = /*#__PURE__*/React.forwardRef(function GridColumnsHeader(props, ref) {
  var innerRef = props.innerRef,
      className = props.className,
      other = _objectWithoutProperties(props, _excluded);

  var _useGridColumnHeaders = useGridColumnHeaders({
    innerRef: innerRef
  }),
      isDragging = _useGridColumnHeaders.isDragging,
      getRootProps = _useGridColumnHeaders.getRootProps,
      getInnerProps = _useGridColumnHeaders.getInnerProps,
      getColumnHeaders = _useGridColumnHeaders.getColumnHeaders,
      getColumnGroupHeaders = _useGridColumnHeaders.getColumnGroupHeaders;

  return /*#__PURE__*/_jsxs(GridColumnHeaders, _extends({
    ref: ref
  }, getRootProps(other), {
    children: [/*#__PURE__*/_jsx(GridScrollArea, {
      scrollDirection: "left"
    }), /*#__PURE__*/_jsxs(GridColumnHeadersInner, _extends({
      isDragging: isDragging
    }, getInnerProps(), {
      children: [getColumnGroupHeaders(), getColumnHeaders()]
    })), /*#__PURE__*/_jsx(GridScrollArea, {
      scrollDirection: "right"
    })]
  }));
});