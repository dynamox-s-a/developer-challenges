import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridLogger } from '../../hooks/utils/useGridLogger';
import { GridMainContainer } from '../containers/GridMainContainer';
import { ErrorBoundary } from '../ErrorBoundary';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";

function GridErrorHandler(props) {
  const {
    children
  } = props;
  const apiRef = useGridApiContext();
  const logger = useGridLogger(apiRef, 'GridErrorHandler');
  const rootProps = useGridRootProps();
  const errorState = apiRef.current.state.error;
  return /*#__PURE__*/_jsx(ErrorBoundary, {
    hasError: errorState != null,
    api: apiRef,
    logger: logger,
    render: errorProps => {
      var _rootProps$components;

      return /*#__PURE__*/_jsx(GridMainContainer, {
        children: /*#__PURE__*/_jsx(rootProps.components.ErrorOverlay, _extends({}, errorProps, errorState, (_rootProps$components = rootProps.componentsProps) == null ? void 0 : _rootProps$components.errorOverlay))
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
  children: PropTypes.node
} : void 0;
export { GridErrorHandler };