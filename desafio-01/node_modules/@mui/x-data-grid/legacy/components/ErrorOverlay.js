import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["error", "hasError", "errorInfo"];
import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay } from './containers/GridOverlay';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { jsx as _jsx } from "react/jsx-runtime";
// TODO v6: rename to GridErrorOverlay
export var ErrorOverlay = /*#__PURE__*/React.forwardRef(function ErrorOverlay(props, ref) {
  var error = props.error,
      hasError = props.hasError,
      errorInfo = props.errorInfo,
      other = _objectWithoutProperties(props, _excluded);

  var apiRef = useGridApiContext();
  var defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');
  var rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  return /*#__PURE__*/_jsx(GridOverlay, _extends({
    ref: ref,
    sx: {
      width: '100%',
      minHeight: 2 * rowHeight
    }
  }, other, {
    children: (error == null ? void 0 : error.message) || defaultLabel
  }));
});