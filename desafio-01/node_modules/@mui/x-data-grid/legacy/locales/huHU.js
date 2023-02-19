import { huHU as huHUCore } from '@mui/material/locale';
import { getGridLocalization } from '../utils/getGridLocalization';
var huHUGrid = {
  // Root
  noRowsLabel: 'Nincsenek sorok',
  noResultsOverlayLabel: 'Nincs találat.',
  errorOverlayDefaultLabel: 'Váratlan hiba történt.',
  // Density selector toolbar button text
  toolbarDensity: 'Sormagasság',
  toolbarDensityLabel: 'Sormagasság',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Normál',
  toolbarDensityComfortable: 'Kényelmes',
  // Columns selector toolbar button text
  toolbarColumns: 'Oszlopok',
  toolbarColumnsLabel: 'Oszlopok kiválasztása',
  // Filters toolbar button text
  toolbarFilters: 'Szűrők',
  toolbarFiltersLabel: 'Szűrők megjelenítése',
  toolbarFiltersTooltipHide: 'Szűrők elrejtése',
  toolbarFiltersTooltipShow: 'Szűrők megjelenítése',
  toolbarFiltersTooltipActive: function toolbarFiltersTooltipActive(count) {
    return "".concat(count, " akt\xEDv sz\u0171r\u0151");
  },
  // Quick filter toolbar field
  // toolbarQuickFilterPlaceholder: 'Search…',
  // toolbarQuickFilterLabel: 'Search',
  // toolbarQuickFilterDeleteIconLabel: 'Clear',
  // Export selector toolbar button text
  toolbarExport: 'Exportálás',
  toolbarExportLabel: 'Exportálás',
  toolbarExportCSV: 'Mentés CSV fájlként',
  toolbarExportPrint: 'Nyomtatás',
  // toolbarExportExcel: 'Download as Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Oszlop keresése',
  columnsPanelTextFieldPlaceholder: 'Oszlop neve',
  columnsPanelDragIconLabel: 'Oszlop átrendezése',
  columnsPanelShowAllButton: 'Összes megjelenítése',
  columnsPanelHideAllButton: 'Összes elrejtése',
  // Filter panel text
  filterPanelAddFilter: 'Szűrő hozzáadása',
  filterPanelDeleteIconLabel: 'Törlés',
  filterPanelLinkOperator: 'Logikai operátor',
  filterPanelOperators: 'Operátorok',
  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'És',
  filterPanelOperatorOr: 'Vagy',
  filterPanelColumns: 'Oszlopok',
  filterPanelInputLabel: 'Érték',
  filterPanelInputPlaceholder: 'Érték szűrése',
  // Filter operators text
  filterOperatorContains: 'tartalmazza:',
  filterOperatorEquals: 'egyenlő ezzel:',
  filterOperatorStartsWith: 'ezzel kezdődik:',
  filterOperatorEndsWith: 'ezzel végződik:',
  filterOperatorIs: 'a következő:',
  filterOperatorNot: 'nem a következő:',
  filterOperatorAfter: 'ezutáni:',
  filterOperatorOnOrAfter: 'ekkori vagy ezutáni:',
  filterOperatorBefore: 'ezelőtti:',
  filterOperatorOnOrBefore: 'ekkori vagy ezelőtti:',
  filterOperatorIsEmpty: 'üres',
  filterOperatorIsNotEmpty: 'nem üres',
  filterOperatorIsAnyOf: 'a következők egyike:',
  // Filter values text
  filterValueAny: 'bármilyen',
  filterValueTrue: 'igaz',
  filterValueFalse: 'hamis',
  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuShowColumns: 'Oszlopok megjelenítése',
  columnMenuFilter: 'Szűrők',
  columnMenuHideColumn: 'Elrejtés',
  columnMenuUnsort: 'Sorrend visszaállítása',
  columnMenuSortAsc: 'Növekvő sorrendbe',
  columnMenuSortDesc: 'Csökkenő sorrendbe',
  // Column header text
  columnHeaderFiltersTooltipActive: function columnHeaderFiltersTooltipActive(count) {
    return "".concat(count, " akt\xEDv sz\u0171r\u0151");
  },
  columnHeaderFiltersLabel: 'Szűrők megjelenítése',
  columnHeaderSortIconLabel: 'Átrendezés',
  // Rows selected footer text
  footerRowSelected: function footerRowSelected(count) {
    return "".concat(count.toLocaleString(), " sor kiv\xE1lasztva");
  },
  // Total row amount footer text
  footerTotalRows: 'Összesen:',
  // Total visible row amount footer text
  footerTotalVisibleRows: function footerTotalVisibleRows(visibleCount, totalCount) {
    return "".concat(visibleCount.toLocaleString(), " (\xF6sszesen: ").concat(totalCount.toLocaleString(), ")");
  },
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Jelölőnégyzetes kijelölés',
  checkboxSelectionSelectAllRows: 'Minden sor kijelölése',
  checkboxSelectionUnselectAllRows: 'Minden sor kijelölésének törlése',
  checkboxSelectionSelectRow: 'Sor kijelölése',
  checkboxSelectionUnselectRow: 'Sor kijelölésének törlése',
  // Boolean cell text
  booleanCellTrueLabel: 'igen',
  booleanCellFalseLabel: 'nem',
  // Actions cell more text
  actionsCellMore: 'további',
  // Column pinning text
  pinToLeft: 'Rögzítés balra',
  pinToRight: 'Rögzítés jobbra',
  unpin: 'Rögzítés törlése',
  // Tree Data
  treeDataGroupingHeaderName: 'Csoport',
  treeDataExpand: 'gyermekek megjelenítése',
  treeDataCollapse: 'gyermekek elrejtése',
  // Grouping columns
  groupingColumnHeaderName: 'Csoportosítás',
  groupColumn: function groupColumn(name) {
    return "Csoportos\xEDt\xE1s ".concat(name, " szerint");
  },
  unGroupColumn: function unGroupColumn(name) {
    return "".concat(name, " szerinti csoportos\xEDt\xE1s t\xF6rl\xE9se");
  },
  // Master/detail
  // detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Kibontás',
  collapseDetailPanel: 'Összecsukás' // Row reordering text
  // rowReorderingHeaderName: 'Row reordering',
  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',

};
export var huHU = getGridLocalization(huHUGrid, huHUCore);