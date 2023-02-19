import { createSelector } from '../../../utils/createSelector';
export var gridRowsStateSelector = function gridRowsStateSelector(state) {
  return state.rows;
};
export var gridRowCountSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.totalRowCount;
});
export var gridRowsLoadingSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.loading;
});
export var gridTopLevelRowCountSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.totalTopLevelRowCount;
});
export var gridRowsLookupSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.idRowsLookup;
});
export var gridRowsIdToIdLookupSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.idToIdLookup;
});
export var gridRowTreeSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.tree;
});
export var gridRowGroupingNameSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.groupingName;
});
export var gridRowTreeDepthSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.treeDepth;
});
export var gridRowIdsSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows.ids;
});
/**
 * @ignore - do not document.
 */

export var gridAdditionalRowGroupsSelector = createSelector(gridRowsStateSelector, function (rows) {
  return rows == null ? void 0 : rows.additionalRowGroups;
});
/**
 * @ignore - do not document.
 */

export var gridPinnedRowsSelector = createSelector(gridAdditionalRowGroupsSelector, function (additionalRowGroups) {
  return additionalRowGroups == null ? void 0 : additionalRowGroups.pinnedRows;
});
/**
 * @ignore - do not document.
 */

export var gridPinnedRowsCountSelector = createSelector(gridPinnedRowsSelector, function (pinnedRows) {
  var _pinnedRows$top, _pinnedRows$bottom;

  return ((pinnedRows == null ? void 0 : (_pinnedRows$top = pinnedRows.top) == null ? void 0 : _pinnedRows$top.length) || 0) + ((pinnedRows == null ? void 0 : (_pinnedRows$bottom = pinnedRows.bottom) == null ? void 0 : _pinnedRows$bottom.length) || 0);
});