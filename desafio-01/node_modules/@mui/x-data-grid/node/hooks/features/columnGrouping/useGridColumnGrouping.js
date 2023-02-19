"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columnGroupsStateInitializer = void 0;
exports.hasGroupPath = hasGroupPath;
exports.useGridColumnGrouping = exports.unwrapGroupingColumnModel = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var React = _interopRequireWildcard(require("react"));

var _gridColumnGrouping = require("../../../models/gridColumnGrouping");

var _gridColumnGroupsSelector = require("./gridColumnGroupsSelector");

var _gridColumnsSelector = require("../columns/gridColumnsSelector");

var _useGridApiMethod = require("../../utils/useGridApiMethod");

const _excluded = ["groupId", "children"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hasGroupPath(lookupElement) {
  return lookupElement.groupPath !== undefined;
}

// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
const recurrentUnwrapGroupingColumnModel = (columnGroupNode, parents, unwrappedGroupingModelToComplet) => {
  if ((0, _gridColumnGrouping.isLeaf)(columnGroupNode)) {
    if (unwrappedGroupingModelToComplet[columnGroupNode.field] !== undefined) {
      throw new Error([`MUI: columnGroupingModel contains duplicated field`, `column field ${columnGroupNode.field} occurrs two times in the grouping model:`, `- ${unwrappedGroupingModelToComplet[columnGroupNode.field].join(' > ')}`, `- ${parents.join(' > ')}`].join('\n'));
    }

    unwrappedGroupingModelToComplet[columnGroupNode.field] = parents;
    return;
  }

  const {
    groupId,
    children
  } = columnGroupNode;
  children.forEach(child => {
    recurrentUnwrapGroupingColumnModel(child, [...parents, groupId], unwrappedGroupingModelToComplet);
  });
};
/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */


const unwrapGroupingColumnModel = columnGroupingModel => {
  if (!columnGroupingModel) {
    return {};
  }

  const unwrappedSubTree = {};
  columnGroupingModel.forEach(columnGroupNode => {
    recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
  });
  return unwrappedSubTree;
};

exports.unwrapGroupingColumnModel = unwrapGroupingColumnModel;

const createGroupLookup = columnGroupingModel => {
  let groupLookup = {};
  columnGroupingModel.forEach(node => {
    if ((0, _gridColumnGrouping.isLeaf)(node)) {
      return;
    }

    const {
      groupId,
      children
    } = node,
          other = (0, _objectWithoutPropertiesLoose2.default)(node, _excluded);

    if (!groupId) {
      throw new Error('MUI: An element of the columnGroupingModel does not have either `field` or `groupId`.');
    }

    if (!children) {
      console.warn(`MUI: group groupId=${groupId} has no children.`);
    }

    const groupParam = (0, _extends2.default)({}, other, {
      groupId
    });
    const subTreeLookup = createGroupLookup(children);

    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(`MUI: The groupId ${groupId} is used multiple times in the columnGroupingModel.`);
    }

    groupLookup = (0, _extends2.default)({}, groupLookup, subTreeLookup, {
      [groupId]: groupParam
    });
  });
  return (0, _extends2.default)({}, groupLookup);
};

const columnGroupsStateInitializer = (state, props) => {
  var _props$columnGrouping;

  const groupLookup = createGroupLookup((_props$columnGrouping = props.columnGroupingModel) != null ? _props$columnGrouping : []);
  return (0, _extends2.default)({}, state, {
    columnGrouping: {
      lookup: groupLookup,
      groupCollapsedModel: {}
    }
  });
};
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */


exports.columnGroupsStateInitializer = columnGroupsStateInitializer;

const useGridColumnGrouping = (apiRef, props) => {
  var _props$experimentalFe2;

  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback(field => {
    var _columnLookup$field$g, _columnLookup$field;

    const columnLookup = (0, _gridColumnsSelector.gridColumnLookupSelector)(apiRef);
    return (_columnLookup$field$g = (_columnLookup$field = columnLookup[field]) == null ? void 0 : _columnLookup$field.groupPath) != null ? _columnLookup$field$g : [];
  }, [apiRef]);
  const getAllGroupDetails = React.useCallback(() => {
    const columnGroupLookup = (0, _gridColumnGroupsSelector.gridColumnGroupsLookupSelector)(apiRef);
    return columnGroupLookup;
  }, [apiRef]);
  const columnGroupingApi = {
    unstable_getColumnGroupPath: getColumnGroupPath,
    unstable_getAllGroupDetails: getAllGroupDetails
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, columnGroupingApi, 'GridColumnGroupingApi');
  /**
   * EFFECTS
   */
  // The effect does not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    var _props$experimentalFe, _props$columnGrouping2;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.columnGrouping)) {
      return;
    }

    const groupLookup = createGroupLookup((_props$columnGrouping2 = props.columnGroupingModel) != null ? _props$columnGrouping2 : []);
    apiRef.current.setState(state => (0, _extends2.default)({}, state, {
      columnGrouping: (0, _extends2.default)({}, state.columnGrouping, {
        lookup: groupLookup
      })
    }));
  }, [apiRef, props.columnGroupingModel, (_props$experimentalFe2 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe2.columnGrouping]);
};

exports.useGridColumnGrouping = useGridColumnGrouping;