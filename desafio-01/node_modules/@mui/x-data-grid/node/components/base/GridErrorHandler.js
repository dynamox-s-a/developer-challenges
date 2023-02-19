"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridErrorHandler = GridErrorHandler;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _useGridLogger = require("../../hooks/utils/useGridLogger");

var _GridMainContainer = require("../containers/GridMainContainer");

var _ErrorBoundary = require("../ErrorBoundary");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function GridErrorHandler(props) {
  const {
    children
  } = props;
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'GridErrorHandler');
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const errorState = apiRef.current.state.error;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorBoundary.ErrorBoundary, {
    hasError: errorState != null,
    api: apiRef,
    logger: logger,
    render: errorProps => {
      var _rootProps$components;

      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridMainContainer.GridMainContainer, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(rootProps.components.ErrorOverlay, (0, _extends2.default)({}, errorProps, errorState, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.errorOverlay))
      });
    },
    children: children
  });
}

process.env.NODE_ENV !== "production" ? GridErrorHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node
} : void 0;