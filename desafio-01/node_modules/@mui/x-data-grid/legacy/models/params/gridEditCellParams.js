// TODO v6 - remove

/**
 * Params passed to `apiRef.current.setEditCellValue`.
 */
// TODO v6 - remove
// TODO v6 - remove
var GridCellEditStartReasons;
/**
 * Params passed to the `cellEditStart` event.
 */

(function (GridCellEditStartReasons) {
  GridCellEditStartReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
  GridCellEditStartReasons["printableKeyDown"] = "printableKeyDown";
  GridCellEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
})(GridCellEditStartReasons || (GridCellEditStartReasons = {}));

var GridCellEditStopReasons;
/**
 * Params passed to the `cellEditStop event.
 */

(function (GridCellEditStopReasons) {
  GridCellEditStopReasons["cellFocusOut"] = "cellFocusOut";
  GridCellEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
  GridCellEditStopReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStopReasons["tabKeyDown"] = "tabKeyDown";
  GridCellEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridCellEditStopReasons || (GridCellEditStopReasons = {}));

// https://github.com/mui/mui-x/pull/3738#discussion_r798504277
export { GridCellEditStartReasons, GridCellEditStopReasons };