"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridComponent = void 0;

var _useGridInitialization = require("../hooks/core/useGridInitialization");

var _useGridInitializeState = require("../hooks/utils/useGridInitializeState");

var _useGridClipboard = require("../hooks/features/clipboard/useGridClipboard");

var _useGridColumnMenu = require("../hooks/features/columnMenu/useGridColumnMenu");

var _useGridColumns = require("../hooks/features/columns/useGridColumns");

var _useGridDensity = require("../hooks/features/density/useGridDensity");

var _useGridCsvExport = require("../hooks/features/export/useGridCsvExport");

var _useGridPrintExport = require("../hooks/features/export/useGridPrintExport");

var _useGridFilter = require("../hooks/features/filter/useGridFilter");

var _useGridFocus = require("../hooks/features/focus/useGridFocus");

var _useGridKeyboardNavigation = require("../hooks/features/keyboardNavigation/useGridKeyboardNavigation");

var _useGridPagination = require("../hooks/features/pagination/useGridPagination");

var _useGridPreferencesPanel = require("../hooks/features/preferencesPanel/useGridPreferencesPanel");

var _useGridEditing = require("../hooks/features/editRows/useGridEditing.old");

var _useGridEditing2 = require("../hooks/features/editRows/useGridEditing.new");

var _useGridRows = require("../hooks/features/rows/useGridRows");

var _useGridRowsPreProcessors = require("../hooks/features/rows/useGridRowsPreProcessors");

var _useGridParamsApi = require("../hooks/features/rows/useGridParamsApi");

var _useGridSelection = require("../hooks/features/selection/useGridSelection");

var _useGridSelectionPreProcessors = require("../hooks/features/selection/useGridSelectionPreProcessors");

var _useGridSorting = require("../hooks/features/sorting/useGridSorting");

var _useGridScroll = require("../hooks/features/scroll/useGridScroll");

var _useGridEvents = require("../hooks/features/events/useGridEvents");

var _useGridDimensions = require("../hooks/features/dimensions/useGridDimensions");

var _useGridRowsMeta = require("../hooks/features/rows/useGridRowsMeta");

var _useGridStatePersistence = require("../hooks/features/statePersistence/useGridStatePersistence");

var _useGridColumnSpanning = require("../hooks/features/columns/useGridColumnSpanning");

var _useGridColumnGrouping = require("../hooks/features/columnGrouping/useGridColumnGrouping");

var _useGridColumnGroupingPreProcessors = require("../hooks/features/columnGrouping/useGridColumnGroupingPreProcessors");

const useDataGridComponent = props => {
  var _props$experimentalFe, _props$experimentalFe2;

  const apiRef = (0, _useGridInitialization.useGridInitialization)(undefined, props);
  /**
   * Register all pre-processors called during state initialization here.
   */

  (0, _useGridColumnGroupingPreProcessors.useGridColumnGroupingPreProcessors)(apiRef, props);
  (0, _useGridSelectionPreProcessors.useGridSelectionPreProcessors)(apiRef, props);
  (0, _useGridRowsPreProcessors.useGridRowsPreProcessors)(apiRef);
  /**
   * Register all state initializers here.
   */

  (0, _useGridInitializeState.useGridInitializeState)(_useGridSelection.selectionStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumns.columnsStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumnGrouping.columnGroupsStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridRows.rowsStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.newEditingApi ? _useGridEditing2.editingStateInitializer : _useGridEditing.editingStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridFocus.focusStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridSorting.sortingStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridPreferencesPanel.preferencePanelStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridFilter.filterStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridDensity.densityStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridPagination.paginationStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridRowsMeta.rowsMetaStateInitializer, apiRef, props);
  (0, _useGridInitializeState.useGridInitializeState)(_useGridColumnMenu.columnMenuStateInitializer, apiRef, props);
  (0, _useGridKeyboardNavigation.useGridKeyboardNavigation)(apiRef, props);
  (0, _useGridSelection.useGridSelection)(apiRef, props);
  (0, _useGridColumns.useGridColumns)(apiRef, props);
  (0, _useGridRows.useGridRows)(apiRef, props);
  (0, _useGridParamsApi.useGridParamsApi)(apiRef);
  (0, _useGridColumnSpanning.useGridColumnSpanning)(apiRef);
  (0, _useGridColumnGrouping.useGridColumnGrouping)(apiRef, props);
  const useGridEditing = (_props$experimentalFe2 = props.experimentalFeatures) != null && _props$experimentalFe2.newEditingApi ? _useGridEditing2.useGridEditing : _useGridEditing.useGridEditing;
  useGridEditing(apiRef, props);
  (0, _useGridFocus.useGridFocus)(apiRef, props);
  (0, _useGridPreferencesPanel.useGridPreferencesPanel)(apiRef, props);
  (0, _useGridFilter.useGridFilter)(apiRef, props);
  (0, _useGridSorting.useGridSorting)(apiRef, props);
  (0, _useGridDensity.useGridDensity)(apiRef, props);
  (0, _useGridPagination.useGridPagination)(apiRef, props);
  (0, _useGridRowsMeta.useGridRowsMeta)(apiRef, props);
  (0, _useGridScroll.useGridScroll)(apiRef, props);
  (0, _useGridColumnMenu.useGridColumnMenu)(apiRef);
  (0, _useGridCsvExport.useGridCsvExport)(apiRef);
  (0, _useGridPrintExport.useGridPrintExport)(apiRef, props);
  (0, _useGridClipboard.useGridClipboard)(apiRef);
  (0, _useGridDimensions.useGridDimensions)(apiRef, props);
  (0, _useGridEvents.useGridEvents)(apiRef, props);
  (0, _useGridStatePersistence.useGridStatePersistence)(apiRef);
  return apiRef;
};

exports.useDataGridComponent = useDataGridComponent;