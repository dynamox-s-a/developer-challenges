import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var _excluded = ["groupId", "children"];
import * as React from 'react';
import { isLeaf } from '../../../models/gridColumnGrouping';
import { gridColumnGroupsLookupSelector } from './gridColumnGroupsSelector';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
export function hasGroupPath(lookupElement) {
  return lookupElement.groupPath !== undefined;
}

// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
var recurrentUnwrapGroupingColumnModel = function recurrentUnwrapGroupingColumnModel(columnGroupNode, parents, unwrappedGroupingModelToComplet) {
  if (isLeaf(columnGroupNode)) {
    if (unwrappedGroupingModelToComplet[columnGroupNode.field] !== undefined) {
      throw new Error(["MUI: columnGroupingModel contains duplicated field", "column field ".concat(columnGroupNode.field, " occurrs two times in the grouping model:"), "- ".concat(unwrappedGroupingModelToComplet[columnGroupNode.field].join(' > ')), "- ".concat(parents.join(' > '))].join('\n'));
    }

    unwrappedGroupingModelToComplet[columnGroupNode.field] = parents;
    return;
  }

  var groupId = columnGroupNode.groupId,
      children = columnGroupNode.children;
  children.forEach(function (child) {
    recurrentUnwrapGroupingColumnModel(child, [].concat(_toConsumableArray(parents), [groupId]), unwrappedGroupingModelToComplet);
  });
};
/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */


export var unwrapGroupingColumnModel = function unwrapGroupingColumnModel(columnGroupingModel) {
  if (!columnGroupingModel) {
    return {};
  }

  var unwrappedSubTree = {};
  columnGroupingModel.forEach(function (columnGroupNode) {
    recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
  });
  return unwrappedSubTree;
};

var createGroupLookup = function createGroupLookup(columnGroupingModel) {
  var groupLookup = {};
  columnGroupingModel.forEach(function (node) {
    if (isLeaf(node)) {
      return;
    }

    var groupId = node.groupId,
        children = node.children,
        other = _objectWithoutProperties(node, _excluded);

    if (!groupId) {
      throw new Error('MUI: An element of the columnGroupingModel does not have either `field` or `groupId`.');
    }

    if (!children) {
      console.warn("MUI: group groupId=".concat(groupId, " has no children."));
    }

    var groupParam = _extends({}, other, {
      groupId: groupId
    });

    var subTreeLookup = createGroupLookup(children);

    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error("MUI: The groupId ".concat(groupId, " is used multiple times in the columnGroupingModel."));
    }

    groupLookup = _extends({}, groupLookup, subTreeLookup, _defineProperty({}, groupId, groupParam));
  });
  return _extends({}, groupLookup);
};

export var columnGroupsStateInitializer = function columnGroupsStateInitializer(state, props) {
  var _props$columnGrouping;

  var groupLookup = createGroupLookup((_props$columnGrouping = props.columnGroupingModel) != null ? _props$columnGrouping : []);
  return _extends({}, state, {
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

export var useGridColumnGrouping = function useGridColumnGrouping(apiRef, props) {
  var _props$experimentalFe2;

  /**
   * API METHODS
   */
  var getColumnGroupPath = React.useCallback(function (field) {
    var _columnLookup$field$g, _columnLookup$field;

    var columnLookup = gridColumnLookupSelector(apiRef);
    return (_columnLookup$field$g = (_columnLookup$field = columnLookup[field]) == null ? void 0 : _columnLookup$field.groupPath) != null ? _columnLookup$field$g : [];
  }, [apiRef]);
  var getAllGroupDetails = React.useCallback(function () {
    var columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);
    return columnGroupLookup;
  }, [apiRef]);
  var columnGroupingApi = {
    unstable_getColumnGroupPath: getColumnGroupPath,
    unstable_getAllGroupDetails: getAllGroupDetails
  };
  useGridApiMethod(apiRef, columnGroupingApi, 'GridColumnGroupingApi');
  /**
   * EFFECTS
   */
  // The effect does not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one

  var isFirstRender = React.useRef(true);
  React.useEffect(function () {
    var _props$experimentalFe, _props$columnGrouping2;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.columnGrouping)) {
      return;
    }

    var groupLookup = createGroupLookup((_props$columnGrouping2 = props.columnGroupingModel) != null ? _props$columnGrouping2 : []);
    apiRef.current.setState(function (state) {
      return _extends({}, state, {
        columnGrouping: _extends({}, state.columnGrouping, {
          lookup: groupLookup
        })
      });
    });
  }, [apiRef, props.columnGroupingModel, (_props$experimentalFe2 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe2.columnGrouping]);
};