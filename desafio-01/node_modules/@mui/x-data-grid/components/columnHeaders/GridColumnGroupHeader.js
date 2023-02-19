import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { unstable_useId as useId } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { jsx as _jsx } from "react/jsx-runtime";

const useUtilityClasses = ownerState => {
  const {
    classes,
    headerAlign,
    isDragging,
    showRightBorder,
    showColumnBorder,
    groupId
  } = ownerState;
  const slots = {
    root: ['columnHeader', headerAlign === 'left' && 'columnHeader--alignLeft', headerAlign === 'center' && 'columnHeader--alignCenter', headerAlign === 'right' && 'columnHeader--alignRight', isDragging && 'columnHeader--moving', showRightBorder && 'withBorder', showColumnBorder && 'columnHeader--showColumnBorder', groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnGroupHeader(props) {
  var _apiRef$current$getRo, _columnGroupsLookup$g;

  const {
    groupId,
    width,
    depth,
    maxDepth,
    fields,
    height,
    colIndex,
    isLastColumn,
    extendRowFullWidth
  } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
  const {
    hasScrollX,
    hasScrollY
  } = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  };
  const group = groupId ? columnGroupsLookup[groupId] : {};
  const {
    headerName = groupId != null ? groupId : '',
    description = '',
    headerAlign = undefined
  } = group;
  let headerComponent;
  const render = groupId && ((_columnGroupsLookup$g = columnGroupsLookup[groupId]) == null ? void 0 : _columnGroupsLookup$g.renderHeaderGroup);
  const renderParams = {
    groupId,
    headerName,
    description,
    depth,
    maxDepth,
    fields,
    colIndex,
    isLastColumn
  };

  if (groupId && render) {
    headerComponent = render(renderParams);
  }

  const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  const showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;
  const showColumnBorder = rootProps.showColumnRightBorder;

  const ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder,
    showColumnBorder,
    headerAlign,
    depth,
    isDragging: false
  });

  const label = headerName != null ? headerName : groupId;
  const id = useId();
  const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
  const classes = useUtilityClasses(ownerState);
  const headerClassName = typeof group.headerClassName === 'function' ? group.headerClassName(renderParams) : group.headerClassName;
  return /*#__PURE__*/_jsx(GridGenericColumnHeaderItem, {
    classes: classes,
    columnMenuOpen: false,
    colIndex: colIndex,
    height: height,
    isResizing: false,
    sortDirection: null,
    hasFocus: false,
    tabIndex: -1,
    isDraggable: false,
    headerComponent: headerComponent,
    headerClassName: headerClassName,
    description: description,
    elementId: elementId,
    width: width,
    columnMenuIconButton: null,
    columnTitleIconButtons: null,
    resizable: false,
    label: label,
    "aria-colspan": fields.length // The fields are wrapped between |-...-| to avoid confusion between fields "id" and "id2" when using selector data-fields~=
    ,
    "data-fields": `|-${fields.join('-|-')}-|`,
    disableHeaderSeparator: true
  });
}

export { GridColumnGroupHeader };