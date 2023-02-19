import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridVisibleRowCountSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridRowCountSelector, gridRowsLoadingSelector } from '../../hooks/features/rows/gridRowsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridDensityTotalHeaderHeightSelector } from '../../hooks/features/density/densitySelector';
import { jsx as _jsx } from "react/jsx-runtime";

function GridOverlayWrapper(props) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const totalHeaderHeight = useGridSelector(apiRef, gridDensityTotalHeaderHeightSelector);
  const [viewportInnerSize, setViewportInnerSize] = React.useState(() => apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  const handleViewportSizeChange = React.useCallback(() => {
    setViewportInnerSize(apiRef.current.getRootDimensions()?.viewportInnerSize ?? null);
  }, [apiRef]);
  useEnhancedEffect(() => {
    return apiRef.current.subscribeEvent('viewportInnerSizeChange', handleViewportSizeChange);
  }, [apiRef, handleViewportSizeChange]);
  let height = viewportInnerSize?.height ?? 0;

  if (rootProps.autoHeight && height === 0) {
    height = 'auto';
  }

  if (!viewportInnerSize) {
    return null;
  }

  return /*#__PURE__*/_jsx("div", _extends({
    style: {
      height,
      width: viewportInnerSize?.width ?? 0,
      position: 'absolute',
      top: totalHeaderHeight,
      bottom: height === 'auto' ? 0 : undefined
    }
  }, props));
}

export function GridOverlays() {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const visibleRowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const loading = useGridSelector(apiRef, gridRowsLoadingSelector);
  const showNoRowsOverlay = !loading && totalRowCount === 0;
  const showNoResultsOverlay = !loading && totalRowCount > 0 && visibleRowCount === 0;
  let overlay = null;

  if (showNoRowsOverlay) {
    overlay = /*#__PURE__*/_jsx(rootProps.components.NoRowsOverlay, _extends({}, rootProps.componentsProps?.noRowsOverlay));
  }

  if (showNoResultsOverlay) {
    overlay = /*#__PURE__*/_jsx(rootProps.components.NoResultsOverlay, _extends({}, rootProps.componentsProps?.noResultsOverlay));
  }

  if (loading) {
    overlay = /*#__PURE__*/_jsx(rootProps.components.LoadingOverlay, _extends({}, rootProps.componentsProps?.loadingOverlay));
  }

  if (overlay === null) {
    return null;
  }

  return /*#__PURE__*/_jsx(GridOverlayWrapper, {
    children: overlay
  });
}