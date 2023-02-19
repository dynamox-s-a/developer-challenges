"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridColumnGroupsLookupSelector = exports.gridColumnGroupingSelector = void 0;

var _createSelector = require("../../../utils/createSelector");

/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
const gridColumnGroupingSelector = state => state.columnGrouping;

exports.gridColumnGroupingSelector = gridColumnGroupingSelector;
const gridColumnGroupsLookupSelector = (0, _createSelector.createSelector)(gridColumnGroupingSelector, columnGrouping => columnGrouping.lookup);
exports.gridColumnGroupsLookupSelector = gridColumnGroupsLookupSelector;