"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridRowsPreProcessors = void 0;

var _strategyProcessing = require("../../core/strategyProcessing");

const flatRowTreeCreationMethod = ({
  ids,
  idRowsLookup,
  idToIdLookup,
  previousTree
}) => {
  const tree = {};

  for (let i = 0; i < ids.length; i += 1) {
    const rowId = ids[i];

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
    groupingName: _strategyProcessing.GRID_DEFAULT_STRATEGY,
    tree,
    treeDepth: 1,
    idRowsLookup,
    idToIdLookup,
    ids
  };
};

const useGridRowsPreProcessors = apiRef => {
  (0, _strategyProcessing.useGridRegisterStrategyProcessor)(apiRef, _strategyProcessing.GRID_DEFAULT_STRATEGY, 'rowTreeCreation', flatRowTreeCreationMethod);
};

exports.useGridRowsPreProcessors = useGridRowsPreProcessors;