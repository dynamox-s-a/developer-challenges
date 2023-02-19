"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCellEditStopReasons = exports.GridCellEditStartReasons = void 0;
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

exports.GridCellEditStartReasons = GridCellEditStartReasons;

(function (GridCellEditStartReasons) {
  GridCellEditStartReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
  GridCellEditStartReasons["printableKeyDown"] = "printableKeyDown";
  GridCellEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
})(GridCellEditStartReasons || (exports.GridCellEditStartReasons = GridCellEditStartReasons = {}));

var GridCellEditStopReasons;
/**
 * Params passed to the `cellEditStop event.
 */

exports.GridCellEditStopReasons = GridCellEditStopReasons;

(function (GridCellEditStopReasons) {
  GridCellEditStopReasons["cellFocusOut"] = "cellFocusOut";
  GridCellEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
  GridCellEditStopReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStopReasons["tabKeyDown"] = "tabKeyDown";
  GridCellEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridCellEditStopReasons || (exports.GridCellEditStopReasons = GridCellEditStopReasons = {}));