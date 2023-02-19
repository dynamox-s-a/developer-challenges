import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _extends from "@babel/runtime/helpers/esm/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import { useEventCallback } from '@mui/material/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowModes, GridEditModes, GridCellModes } from '../../../models/gridEditRowModel';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridEditRowsStateSelector } from './gridEditRowsSelector';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { useGridApiOptionHandler, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
export var useGridRowEditing = function useGridRowEditing(apiRef, props) {
  var _props$experimentalFe2, _props$experimentalFe4;

  var focusTimeout = React.useRef(null);
  var nextFocusedCell = React.useRef(null);
  var columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);

  var buildCallback = function buildCallback(callback) {
    return function () {
      if (props.editMode === GridEditModes.Row) {
        callback.apply(void 0, arguments);
      }
    };
  };

  var setRowMode = React.useCallback(function (id, mode) {
    if (mode === apiRef.current.getRowMode(id)) {
      return;
    }

    apiRef.current.setState(function (state) {
      var newEditRowsState = _extends({}, state.editRows);

      if (mode === GridRowModes.Edit) {
        newEditRowsState[id] = {};
        columns.forEach(function (column) {
          var cellParams = apiRef.current.getCellParams(id, column.field);

          if (cellParams.isEditable) {
            newEditRowsState[id][column.field] = {
              value: cellParams.value
            };
          }
        });
      } else {
        delete newEditRowsState[id];
      }

      return _extends({}, state, {
        editRows: newEditRowsState
      });
    });
    apiRef.current.forceUpdate();
  }, [apiRef, columns]);
  var getRowMode = React.useCallback(function (id) {
    if (props.editMode === GridEditModes.Cell) {
      return GridRowModes.View;
    }

    var editRowsState = gridEditRowsStateSelector(apiRef.current.state);
    return editRowsState[id] ? GridRowModes.Edit : GridRowModes.View;
  }, [apiRef, props.editMode]);
  var commitRowChange = React.useCallback(function (id) {
    var _props$experimentalFe;

    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (props.editMode === GridEditModes.Cell) {
      throw new Error("MUI: You can't commit changes when the edit mode is 'cell'.");
    }

    apiRef.current.unstable_runPendingEditCellValueMutation(id);
    var model = apiRef.current.getEditRowsModel();
    var editRowProps = model[id];

    if (!editRowProps) {
      throw new Error("MUI: Row at id: ".concat(id, " is not being edited."));
    }

    if ((_props$experimentalFe = props.experimentalFeatures) != null && _props$experimentalFe.preventCommitWhileValidating) {
      var isValid = Object.keys(editRowProps).reduce(function (acc, field) {
        return acc && !editRowProps[field].isValidating && !editRowProps[field].error;
      }, true);

      if (!isValid) {
        return false;
      }
    }

    var hasFieldWithError = Object.values(editRowProps).some(function (value) {
      return !!value.error;
    });

    if (hasFieldWithError) {
      return false;
    }

    var fieldsWithValidator = Object.keys(editRowProps).filter(function (field) {
      var column = apiRef.current.getColumn(field);
      return typeof column.preProcessEditCellProps === 'function';
    });

    if (fieldsWithValidator.length > 0) {
      var row = apiRef.current.getRow(id);
      var validatorErrors = fieldsWithValidator.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(field) {
          var column, newEditCellProps;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  column = apiRef.current.getColumn(field);
                  _context.next = 3;
                  return Promise.resolve(column.preProcessEditCellProps({
                    id: id,
                    row: row,
                    props: editRowProps[field]
                  }));

                case 3:
                  newEditCellProps = _context.sent;
                  apiRef.current.unstable_setEditCellProps({
                    id: id,
                    field: field,
                    props: newEditCellProps
                  });
                  return _context.abrupt("return", newEditCellProps.error);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      return Promise.all(validatorErrors).then(function (errors) {
        if (errors.some(function (error) {
          return !!error;
        })) {
          return false;
        }

        apiRef.current.publishEvent('rowEditCommit', id, event);
        return true;
      });
    }

    apiRef.current.publishEvent('rowEditCommit', id, event);
    return true;
  }, [apiRef, props.editMode, (_props$experimentalFe2 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe2.preventCommitWhileValidating]);
  var setRowEditingEditCellValue = React.useCallback(function (params) {
    var model = apiRef.current.getEditRowsModel();
    var editRow = model[params.id];
    var row = apiRef.current.getRow(params.id);
    var isValid = true;
    return new Promise(function (resolve) {
      Object.keys(editRow).forEach( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(field) {
          var column, editCellProps;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  column = apiRef.current.getColumn(field);
                  editCellProps = field === params.field ? {
                    value: params.value
                  } : editRow[field]; // setEditCellProps runs the value parser and returns the updated props

                  editCellProps = apiRef.current.unstable_setEditCellProps({
                    id: params.id,
                    field: field,
                    props: _extends({}, editCellProps, {
                      isValidating: true
                    })
                  });

                  if (!column.preProcessEditCellProps) {
                    _context2.next = 7;
                    break;
                  }

                  _context2.next = 6;
                  return Promise.resolve(column.preProcessEditCellProps({
                    id: params.id,
                    row: row,
                    props: _extends({}, editCellProps, {
                      value: field === params.field ? apiRef.current.unstable_parseValue(params.id, field, params.value) : editCellProps.value
                    })
                  }));

                case 6:
                  editCellProps = _context2.sent;

                case 7:
                  if (editCellProps.error) {
                    isValid = false;
                  }

                  apiRef.current.unstable_setEditCellProps({
                    id: params.id,
                    field: field,
                    props: _extends({}, editCellProps, {
                      isValidating: false
                    })
                  });

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      resolve(isValid);
    });
  }, [apiRef]);
  var rowEditingApi = {
    setRowMode: setRowMode,
    getRowMode: getRowMode,
    commitRowChange: commitRowChange,
    unstable_setRowEditingEditCellValue: setRowEditingEditCellValue
  };
  useGridApiMethod(apiRef, rowEditingApi, 'EditRowApi');
  var handleCellKeyDown = React.useCallback( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(params, event) {
      var cellMode, isEditable, isEditMode, rowParams, _props$experimentalFe3, isValid;

      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(event.which === 229)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return");

            case 2:
              cellMode = params.cellMode, isEditable = params.isEditable;

              if (isEditable) {
                _context3.next = 5;
                break;
              }

              return _context3.abrupt("return");

            case 5:
              isEditMode = cellMode === GridCellModes.Edit;
              rowParams = apiRef.current.getRowParams(params.id);

              if (!isEditMode) {
                _context3.next = 20;
                break;
              }

              if (!(event.key === 'Enter')) {
                _context3.next = 17;
                break;
              }

              _context3.next = 11;
              return apiRef.current.commitRowChange(params.id);

            case 11:
              isValid = _context3.sent;

              if (!(!isValid && (_props$experimentalFe3 = props.experimentalFeatures) != null && _props$experimentalFe3.preventCommitWhileValidating)) {
                _context3.next = 14;
                break;
              }

              return _context3.abrupt("return");

            case 14:
              apiRef.current.publishEvent('rowEditStop', rowParams, event);
              _context3.next = 18;
              break;

            case 17:
              if (event.key === 'Escape') {
                apiRef.current.publishEvent('rowEditStop', rowParams, event);
              }

            case 18:
              _context3.next = 21;
              break;

            case 20:
              if (event.key === 'Enter') {
                apiRef.current.publishEvent('rowEditStart', rowParams, event);
              }

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }(), [apiRef, (_props$experimentalFe4 = props.experimentalFeatures) == null ? void 0 : _props$experimentalFe4.preventCommitWhileValidating]);
  var handleCellDoubleClick = React.useCallback(function (params, event) {
    if (!params.isEditable) {
      return;
    }

    var rowParams = apiRef.current.getRowParams(params.id);
    apiRef.current.publishEvent('rowEditStart', rowParams, event);
  }, [apiRef]);
  var handleEditCellPropsChange = React.useCallback(function (params) {
    var row = apiRef.current.getRow(params.id);
    var model = apiRef.current.getEditRowsModel();
    var editRow = model[params.id];
    Object.keys(editRow).forEach( /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(field) {
        var column, editCellProps, newEditCellProps;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                column = apiRef.current.getColumn(field);

                if (!column.preProcessEditCellProps) {
                  _context4.next = 9;
                  break;
                }

                editCellProps = field === params.field ? params.props : editRow[field];
                _context4.next = 5;
                return Promise.resolve(column.preProcessEditCellProps({
                  id: params.id,
                  row: row,
                  props: editCellProps
                }));

              case 5:
                newEditCellProps = _context4.sent;
                apiRef.current.unstable_setEditCellProps({
                  id: params.id,
                  field: field,
                  props: newEditCellProps
                });
                _context4.next = 10;
                break;

              case 9:
                if (field === params.field) {
                  apiRef.current.unstable_setEditCellProps(params);
                }

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x5) {
        return _ref4.apply(this, arguments);
      };
    }());
  }, [apiRef]);
  var handleRowEditStart = React.useCallback(function (params) {
    apiRef.current.setRowMode(params.id, GridRowModes.Edit);
  }, [apiRef]);
  var handleRowEditStop = React.useCallback(function (params, event) {
    apiRef.current.setRowMode(params.id, GridRowModes.View);

    if (event.key === 'Enter') {
      apiRef.current.publishEvent('cellNavigationKeyDown', params, event);
    }
  }, [apiRef]);
  var handleRowEditCommit = React.useCallback(function (id) {
    var model = apiRef.current.getEditRowsModel();
    var editRow = model[id];

    if (!editRow) {
      throw new Error("MUI: Row at id: ".concat(id, " is not being edited."));
    }

    var row = apiRef.current.getRow(id);

    if (row) {
      var rowUpdate = _extends({}, row);

      Object.keys(editRow).forEach(function (field) {
        var column = apiRef.current.getColumn(field);
        var value = editRow[field].value;

        if (column.valueSetter) {
          rowUpdate = column.valueSetter({
            row: rowUpdate,
            value: value
          });
        } else {
          rowUpdate[field] = value;
        }
      });
      apiRef.current.updateRows([rowUpdate]);
    }
  }, [apiRef]);
  var handleCellFocusIn = React.useCallback(function (params) {
    nextFocusedCell.current = params;
  }, []);

  var commitPropsAndExit = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(params, event) {
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(params.cellMode === GridCellModes.View)) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return");

            case 2:
              nextFocusedCell.current = null;
              focusTimeout.current = setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
                var _nextFocusedCell$curr;

                var rowParams;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(((_nextFocusedCell$curr = nextFocusedCell.current) == null ? void 0 : _nextFocusedCell$curr.id) !== params.id)) {
                          _context5.next = 5;
                          break;
                        }

                        _context5.next = 3;
                        return apiRef.current.commitRowChange(params.id, event);

                      case 3:
                        rowParams = apiRef.current.getRowParams(params.id);
                        apiRef.current.publishEvent('rowEditStop', rowParams, event);

                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })));

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function commitPropsAndExit(_x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }();

  var handleCellFocusOut = useEventCallback(function (params, event) {
    commitPropsAndExit(params, event);
  });
  var handleColumnHeaderDragStart = useEventCallback(function () {
    var cell = gridFocusCellSelector(apiRef);

    if (!cell) {
      return;
    }

    var params = apiRef.current.getCellParams(cell.id, cell.field);
    commitPropsAndExit(params, {});
  });
  useGridApiEventHandler(apiRef, 'cellKeyDown', buildCallback(handleCellKeyDown));
  useGridApiEventHandler(apiRef, 'cellDoubleClick', buildCallback(handleCellDoubleClick));
  useGridApiEventHandler(apiRef, 'editCellPropsChange', buildCallback(handleEditCellPropsChange));
  useGridApiEventHandler(apiRef, 'rowEditStart', buildCallback(handleRowEditStart));
  useGridApiEventHandler(apiRef, 'rowEditStop', buildCallback(handleRowEditStop));
  useGridApiEventHandler(apiRef, 'rowEditCommit', buildCallback(handleRowEditCommit));
  useGridApiEventHandler(apiRef, 'cellFocusIn', buildCallback(handleCellFocusIn));
  useGridApiEventHandler(apiRef, 'cellFocusOut', buildCallback(handleCellFocusOut));
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', buildCallback(handleColumnHeaderDragStart));
  useGridApiOptionHandler(apiRef, 'rowEditCommit', props.onRowEditCommit);
  useGridApiOptionHandler(apiRef, 'rowEditStart', props.onRowEditStart);
  useGridApiOptionHandler(apiRef, 'rowEditStop', props.onRowEditStop);
};