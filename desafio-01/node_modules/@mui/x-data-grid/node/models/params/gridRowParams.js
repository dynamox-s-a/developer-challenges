"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRowEditStopReasons = exports.GridRowEditStartReasons = void 0;

/**
 * Object passed as parameter in the row callbacks.
 */

/**
 * Object passed as parameter in the row `getRowClassName` callback prop.
 */

/**
 * Object passed as parameter in the row `getRowHeight` callback prop.
 */

/**
 * The getRowHeight return value.
 */
var GridRowEditStartReasons;
/**
 * Params passed to the `rowEditStart` event.
 */

exports.GridRowEditStartReasons = GridRowEditStartReasons;

(function (GridRowEditStartReasons) {
  GridRowEditStartReasons["enterKeyDown"] = "enterKeyDown";
  GridRowEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
  GridRowEditStartReasons["printableKeyDown"] = "printableKeyDown";
  GridRowEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
})(GridRowEditStartReasons || (exports.GridRowEditStartReasons = GridRowEditStartReasons = {}));

var GridRowEditStopReasons;
exports.GridRowEditStopReasons = GridRowEditStopReasons;

(function (GridRowEditStopReasons) {
  GridRowEditStopReasons["rowFocusOut"] = "rowFocusOut";
  GridRowEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
  GridRowEditStopReasons["enterKeyDown"] = "enterKeyDown";
  GridRowEditStopReasons["tabKeyDown"] = "tabKeyDown";
  GridRowEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
})(GridRowEditStopReasons || (exports.GridRowEditStopReasons = GridRowEditStopReasons = {}));