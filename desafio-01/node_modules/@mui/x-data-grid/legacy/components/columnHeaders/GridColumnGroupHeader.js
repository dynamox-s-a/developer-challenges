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

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
      headerAlign = ownerState.headerAlign,
      isDragging = ownerState.isDragging,
      showRightBorder = ownerState.showRightBorder,
      showColumnBorder = ownerState.showColumnBorder,
      groupId = ownerState.groupId;
  var slots = {
    root: ['columnHeader', headerAlign === 'left' && 'columnHeader--alignLeft', headerAlign === 'center' && 'columnHeader--alignCenter', headerAlign === 'right' && 'columnHeader--alignRight', isDragging && 'columnHeader--moving', showRightBorder && 'withBorder', showColumnBorder && 'columnHeader--showColumnBorder', groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup'],
    draggableContainer: ['columnHeaderDraggableContainer'],
    titleContainer: ['columnHeaderTitleContainer'],
    titleContainerContent: ['columnHeaderTitleContainerContent']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnGroupHeader(props) {
  var _apiRef$current$getRo, _columnGroupsLookup$g;

  var groupId = props.groupId,
      width = props.width,
      depth = props.depth,
      maxDepth = props.maxDepth,
      fields = props.fields,
      height = props.height,
      colIndex = props.colIndex,
      isLastColumn = props.isLastColumn,
      extendRowFullWidth = props.extendRowFullWidth;
  var rootProps = useGridRootProps();
  var apiRef = useGridApiContext();
  var columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);

  var _ref = (_apiRef$current$getRo = apiRef.current.getRootDimensions()) != null ? _apiRef$current$getRo : {
    hasScrollX: false,
    hasScrollY: false
  },
      hasScrollX = _ref.hasScrollX,
      hasScrollY = _ref.hasScrollY;

  var group = groupId ? columnGroupsLookup[groupId] : {};
  var _group$headerName = group.headerName,
      headerName = _group$headerName === void 0 ? groupId != null ? groupId : '' : _group$headerName,
      _group$description = group.description,
      description = _group$description === void 0 ? '' : _group$description,
      _group$headerAlign = group.headerAlign,
      headerAlign = _group$headerAlign === void 0 ? undefined : _group$headerAlign;
  var headerComponent;
  var render = groupId && ((_columnGroupsLookup$g = columnGroupsLookup[groupId]) == null ? void 0 : _columnGroupsLookup$g.renderHeaderGroup);
  var renderParams = {
    groupId: groupId,
    headerName: headerName,
    description: description,
    depth: depth,
    maxDepth: maxDepth,
    fields: fields,
    colIndex: colIndex,
    isLastColumn: isLastColumn
  };

  if (groupId && render) {
    headerComponent = render(renderParams);
  }

  var removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
  var showRightBorder = !isLastColumn ? rootProps.showColumnRightBorder : !removeLastBorderRight && !extendRowFullWidth;
  var showColumnBorder = rootProps.showColumnRightBorder;

  var ownerState = _extends({}, props, {
    classes: rootProps.classes,
    showRightBorder: showRightBorder,
    showColumnBorder: showColumnBorder,
    headerAlign: headerAlign,
    depth: depth,
    isDragging: false
  });

  var label = headerName != null ? headerName : groupId;
  var id = useId();
  var elementId = groupId === null ? "empty-group-cell-".concat(id) : groupId;
  var classes = useUtilityClasses(ownerState);
  var headerClassName = typeof group.headerClassName === 'function' ? group.headerClassName(renderParams) : group.headerClassName;
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
    "data-fields": "|-".concat(fields.join('-|-'), "-|"),
    disableHeaderSeparator: true
  });
}

export { GridColumnGroupHeader };