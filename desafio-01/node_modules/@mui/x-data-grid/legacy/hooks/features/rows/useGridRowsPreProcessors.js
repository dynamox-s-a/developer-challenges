import { GRID_DEFAULT_STRATEGY, useGridRegisterStrategyProcessor } from '../../core/strategyProcessing';

var flatRowTreeCreationMethod = function flatRowTreeCreationMethod(_ref) {
  var ids = _ref.ids,
      idRowsLookup = _ref.idRowsLookup,
      idToIdLookup = _ref.idToIdLookup,
      previousTree = _ref.previousTree;
  var tree = {};

  for (var i = 0; i < ids.length; i += 1) {
    var rowId = ids[i];

    if (previousTree && previousTree[rowId] && previousTree[rowId].depth === 0 && previousTree[rowId].parent == null && // pinned row can be unpinned
    !previousTree[rowId].isPinned) {
      tree[rowId] = previousTree[rowId];
    } else {
      tree[rowId] = {
        id: rowId,
        depth: 0,
        parent: null,
        groupingKey: '',
        groupingField: null
      };
    }
  }

  return {
    groupingName: GRID_DEFAULT_STRATEGY,
    tree: tree,
    treeDepth: 1,
    idRowsLookup: idRowsLookup,
    idToIdLookup: idToIdLookup,
    ids: ids
  };
};

export var useGridRowsPreProcessors = function useGridRowsPreProcessors(apiRef) {
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'rowTreeCreation', flatRowTreeCreationMethod);
};