"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridDensityValueSelector = exports.gridDensityTotalHeaderHeightSelector = exports.gridDensitySelector = exports.gridDensityRowHeightSelector = exports.gridDensityHeaderHeightSelector = exports.gridDensityHeaderGroupingMaxDepthSelector = exports.gridDensityFactorSelector = void 0;

var _createSelector = require("../../../utils/createSelector");

const gridDensitySelector = state => state.density;

exports.gridDensitySelector = gridDensitySelector;
const gridDensityValueSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.value);
exports.gridDensityValueSelector = gridDensityValueSelector;
const gridDensityRowHeightSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.rowHeight);
exports.gridDensityRowHeightSelector = gridDensityRowHeightSelector;
const gridDensityHeaderHeightSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.headerHeight);
exports.gridDensityHeaderHeightSelector = gridDensityHeaderHeightSelector;
const gridDensityHeaderGroupingMaxDepthSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.headerGroupingMaxDepth);
exports.gridDensityHeaderGroupingMaxDepthSelector = gridDensityHeaderGroupingMaxDepthSelector;
const gridDensityFactorSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.factor);
exports.gridDensityFactorSelector = gridDensityFactorSelector;
const gridDensityTotalHeaderHeightSelector = (0, _createSelector.createSelector)(gridDensitySelector, density => density.headerHeight * (1 + density.headerGroupingMaxDepth));
exports.gridDensityTotalHeaderHeightSelector = gridDensityTotalHeaderHeightSelector;