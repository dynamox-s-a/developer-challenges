import { createSelector } from '../../../utils/createSelector';

/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
export var gridColumnGroupingSelector = function gridColumnGroupingSelector(state) {
  return state.columnGrouping;
};
export var gridColumnGroupsLookupSelector = createSelector(gridColumnGroupingSelector, function (columnGrouping) {
  return columnGrouping.lookup;
});