"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridInitialization = void 0;

var _useGridLoggerFactory = require("./useGridLoggerFactory");

var _useGridApiInitialization = require("./useGridApiInitialization");

var _useGridErrorHandler = require("./useGridErrorHandler");

var _useGridLocaleText = require("./useGridLocaleText");

var _pipeProcessing = require("./pipeProcessing");

var _strategyProcessing = require("./strategyProcessing");

var _useGridStateInitialization = require("./useGridStateInitialization");

/**
 * Initialize the technical pieces of the DataGrid (logger, state, ...) that any DataGrid implementation needs
 */
const useGridInitialization = (inputApiRef, props) => {
  const apiRef = (0, _useGridApiInitialization.useGridApiInitialization)(inputApiRef, props);
  (0, _useGridLoggerFactory.useGridLoggerFactory)(apiRef, props);
  (0, _useGridErrorHandler.useGridErrorHandler)(apiRef, props);
  (0, _useGridStateInitialization.useGridStateInitialization)(apiRef, props);
  (0, _pipeProcessing.useGridPipeProcessing)(apiRef);
  (0, _strategyProcessing.useGridStrategyProcessing)(apiRef);
  (0, _useGridLocaleText.useGridLocaleText)(apiRef, props);
  return apiRef;
};

exports.useGridInitialization = useGridInitialization;