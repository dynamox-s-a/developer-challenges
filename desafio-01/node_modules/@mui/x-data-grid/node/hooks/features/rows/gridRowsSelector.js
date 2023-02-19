"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridTopLevelRowCountSelector = exports.gridRowsStateSelector = exports.gridRowsLookupSelector = exports.gridRowsLoadingSelector = exports.gridRowsIdToIdLookupSelector = exports.gridRowTreeSelector = exports.gridRowTreeDepthSelector = exports.gridRowIdsSelector = exports.gridRowGroupingNameSelector = exports.gridRowCountSelector = exports.gridPinnedRowsSelector = exports.gridPinnedRowsCountSelector = exports.gridAdditionalRowGroupsSelector = void 0;

var _createSelector = require("../../../utils/createSelector");

const gridRowsStateSelector = state => state.rows;

exports.gridRowsStateSelector = gridRowsStateSelector;
const gridRowCountSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.totalRowCount);
exports.gridRowCountSelector = gridRowCountSelector;
const gridRowsLoadingSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.loading);
exports.gridRowsLoadingSelector = gridRowsLoadingSelector;
const gridTopLevelRowCountSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.totalTopLevelRowCount);
exports.gridTopLevelRowCountSelector = gridTopLevelRowCountSelector;
const gridRowsLookupSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.idRowsLookup);
exports.gridRowsLookupSelector = gridRowsLookupSelector;
const gridRowsIdToIdLookupSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.idToIdLookup);
exports.gridRowsIdToIdLookupSelector = gridRowsIdToIdLookupSelector;
const gridRowTreeSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.tree);
exports.gridRowTreeSelector = gridRowTreeSelector;
const gridRowGroupingNameSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.groupingName);
exports.gridRowGroupingNameSelector = gridRowGroupingNameSelector;
const gridRowTreeDepthSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.treeDepth);
exports.gridRowTreeDepthSelector = gridRowTreeDepthSelector;
const gridRowIdsSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows.ids);
/**
 * @ignore - do not document.
 */

exports.gridRowIdsSelector = gridRowIdsSelector;
const gridAdditionalRowGroupsSelector = (0, _createSelector.createSelector)(gridRowsStateSelector, rows => rows == null ? void 0 : rows.additionalRowGroups);
/**
 * @ignore - do not document.
 */

exports.gridAdditionalRowGroupsSelector = gridAdditionalRowGroupsSelector;
const gridPinnedRowsSelector = (0, _createSelector.createSelector)(gridAdditionalRowGroupsSelector, additionalRowGroups => additionalRowGroups == null ? void 0 : additionalRowGroups.pinnedRows);
/**
 * @ignore - do not document.
 */

exports.gridPinnedRowsSelector = gridPinnedRowsSelector;
const gridPinnedRowsCountSelector = (0, _createSelector.createSelector)(gridPinnedRowsSelector, pinnedRows => {
  var _pinnedRows$top, _pinnedRows$bottom;

  return ((pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.length) || 0) + ((pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.length) || 0);
});
exports.gridPinnedRowsCountSelector = gridPinnedRowsCountSelector;