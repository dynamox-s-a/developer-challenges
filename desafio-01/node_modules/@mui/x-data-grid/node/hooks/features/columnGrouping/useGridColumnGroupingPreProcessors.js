"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridColumnGroupingPreProcessors = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _pipeProcessing = require("../../core/pipeProcessing");

var _utils = require("../../../utils/utils");

var _useGridColumnGrouping = require("./useGridColumnGrouping");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useGridColumnGroupingPreProcessors = (apiRef, props) => {
  var _props$experimentalFe2;

  const addHeaderGroups = React.useCallback(columnsState => {
    var _props$experimentalFe;

    if (!((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.columnGrouping)) {
      return columnsState;
    }

    const unwrappedGroupingModel = (0, _useGridColumnGrouping.unwrapGroupingColumnModel)(props.columnGroupingModel);
    columnsState.all.forEach(field => {
      var _unwrappedGroupingMod, _unwrappedGroupingMod2;

      const newGroupPath = (_unwrappedGroupingMod = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod : [];
      const lookupElement = columnsState.lookup[field];

      if ((0, _useGridColumnGrouping.hasGroupPath)(lookupElement) && (0, _utils.isDeepEqual)(newGroupPath, lookupElement == null ? void 0 : lookupElement.groupPath)) {
        // Avoid modifying the pointer to allow shadow comparison in https://github.com/mui/mui-x/blob/f90afbf10a1264ee8b453d7549dd7cdd6110a4ed/packages/grid/x-data-grid/src/hooks/features/columns/gridColumnsUtils.ts#L446:L453
        return;
      }

      columnsState.lookup[field] = (0, _extends2.default)({}, columnsState.lookup[field], {
        groupPath: (_unwrappedGroupingMod2 = unwrappedGroupingModel[field]) != null ? _unwrappedGroupingMod2 : []
      });
    });
    return columnsState;
  }, [props.columnGroupingModel, (_props$experimentalFe2 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe2.columnGrouping]);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', addHeaderGroups);
};

exports.useGridColumnGroupingPreProcessors = useGridColumnGroupingPreProcessors;