"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridColumnGroupHeader = GridColumnGroupHeader;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _utils = require("@mui/utils");

var _material = require("@mui/material");

var _gridClasses = require("../../constants/gridClasses");

var _useGridRootProps = require("../../hooks/utils/useGridRootProps");

var _gridColumnGroupsSelector = require("../../hooks/features/columnGrouping/gridColumnGroupsSelector");

var _useGridApiContext = require("../../hooks/utils/useGridApiContext");

var _useGridSelector = require("../../hooks/utils/useGridSelector");

var _GridGenericColumnHeaderItem = require("./GridGenericColumnHeaderItem");

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  return (0, _material.unstable_composeClasses)(slots, _gridClasses.getDataGridUtilityClass, classes);
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
  const rootProps = (0, _useGridRootProps.useGridRootProps)();
  const apiRef = (0, _useGridApiContext.useGridApiContext)();
  const columnGroupsLookup = (0, _useGridSelector.useGridSelector)(apiRef, _gridColumnGroupsSelector.gridColumnGroupsLookupSelector);
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
  const ownerState = (0, _extends2.default)({}, props, {
    classes: rootProps.classes,
    showRightBorder,
    showColumnBorder,
    headerAlign,
    depth,
    isDragging: false
  });
  const label = headerName != null ? headerName : groupId;
  const id = (0, _utils.unstable_useId)();
  const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
  const classes = useUtilityClasses(ownerState);
  const headerClassName = typeof group.headerClassName === 'function' ? group.headerClassName(renderParams) : group.headerClassName;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridGenericColumnHeaderItem.GridGenericColumnHeaderItem, {
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