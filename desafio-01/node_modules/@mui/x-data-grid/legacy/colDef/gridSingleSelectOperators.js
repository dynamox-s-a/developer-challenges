import _typeof from "@babel/runtime/helpers/esm/typeof";
import { GridFilterInputSingleSelect } from '../components/panel/filterPanel/GridFilterInputSingleSelect';
import { GridFilterInputMultipleSingleSelect } from '../components/panel/filterPanel/GridFilterInputMultipleSingleSelect';

var parseObjectValue = function parseObjectValue(value) {
  if (value == null || _typeof(value) !== 'object') {
    return value;
  }

  return value.value;
};

export var getGridSingleSelectQuickFilterFn = function getGridSingleSelectQuickFilterFn(value, column, apiRef) {
  if (!value) {
    return null;
  }

  var valueOptions = column.valueOptions,
      valueFormatter = column.valueFormatter,
      field = column.field;
  var potentialValues = [parseObjectValue(value).toString()];
  var iterableColumnValues = typeof valueOptions === 'function' ? valueOptions({
    field: field
  }) : valueOptions || [];

  if (iterableColumnValues) {
    iterableColumnValues.forEach(function (option) {
      // for each valueOption, check if the formatted value
      var optionValue;
      var optionLabel;

      if (_typeof(option) === 'object') {
        optionValue = option.value;
        optionLabel = option.label;
      } else {
        optionValue = option;

        if (valueFormatter) {
          optionLabel = valueFormatter({
            value: option,
            field: field,
            api: apiRef.current
          });
        } else {
          optionLabel = option;
        }
      }

      if (optionLabel.slice(0, value.length).toLowerCase() === value.toLowerCase()) {
        if (!potentialValues.includes(optionValue)) {
          potentialValues.push(optionValue.toString());
        }
      }
    });
  }

  return function (_ref) {
    var columnValue = _ref.value;
    return columnValue != null ? potentialValues.includes(parseObjectValue(columnValue).toString()) : false;
  };
};
export var getGridSingleSelectOperators = function getGridSingleSelectOperators() {
  return [{
    value: 'is',
    getApplyFilterFn: function getApplyFilterFn(filterItem) {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }

      return function (_ref2) {
        var value = _ref2.value;
        return parseObjectValue(value) === parseObjectValue(filterItem.value);
      };
    },
    InputComponent: GridFilterInputSingleSelect
  }, {
    value: 'not',
    getApplyFilterFn: function getApplyFilterFn(filterItem) {
      if (filterItem.value == null || filterItem.value === '') {
        return null;
      }

      return function (_ref3) {
        var value = _ref3.value;
        return parseObjectValue(value) !== parseObjectValue(filterItem.value);
      };
    },
    InputComponent: GridFilterInputSingleSelect
  }, {
    value: 'isAnyOf',
    getApplyFilterFn: function getApplyFilterFn(filterItem) {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }

      var filterItemValues = filterItem.value.map(parseObjectValue);
      return function (_ref4) {
        var value = _ref4.value;
        return filterItemValues.includes(parseObjectValue(value));
      };
    },
    InputComponent: GridFilterInputMultipleSingleSelect
  }];
};