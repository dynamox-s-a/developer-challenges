import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useEventCallback } from '@mui/material/utils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowModes, GridEditModes, GridCellModes } from '../../../models/gridEditRowModel';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { gridEditRowsStateSelector } from './gridEditRowsSelector';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import { useGridApiOptionHandler, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
export const useGridRowEditing = (apiRef, props) => {
  const focusTimeout = React.useRef(null);
  const nextFocusedCell = React.useRef(null);
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);

  const buildCallback = callback => (...args) => {
    if (props.editMode === GridEditModes.Row) {
      callback(...args);
    }
  };

  const setRowMode = React.useCallback((id, mode) => {
    if (mode === apiRef.current.getRowMode(id)) {
      return;
    }

    apiRef.current.setState(state => {
      const newEditRowsState = _extends({}, state.editRows);

      if (mode === GridRowModes.Edit) {
        newEditRowsState[id] = {};
        columns.forEach(column => {
          const cellParams = apiRef.current.getCellParams(id, column.field);

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
  const getRowMode = React.useCallback(id => {
    if (props.editMode === GridEditModes.Cell) {
      return GridRowModes.View;
    }

    const editRowsState = gridEditRowsStateSelector(apiRef.current.state);
    return editRowsState[id] ? GridRowModes.Edit : GridRowModes.View;
  }, [apiRef, props.editMode]);
  const commitRowChange = React.useCallback((id, event = {}) => {
    if (props.editMode === GridEditModes.Cell) {
      throw new Error(`MUI: You can't commit changes when the edit mode is 'cell'.`);
    }

    apiRef.current.unstable_runPendingEditCellValueMutation(id);
    const model = apiRef.current.getEditRowsModel();
    const editRowProps = model[id];

    if (!editRowProps) {
      throw new Error(`MUI: Row at id: ${id} is not being edited.`);
    }

    if (props.experimentalFeatures?.preventCommitWhileValidating) {
      const isValid = Object.keys(editRowProps).reduce((acc, field) => {
        return acc && !editRowProps[field].isValidating && !editRowProps[field].error;
      }, true);

      if (!isValid) {
        return false;
      }
    }

    const hasFieldWithError = Object.values(editRowProps).some(value => !!value.error);

    if (hasFieldWithError) {
      return false;
    }

    const fieldsWithValidator = Object.keys(editRowProps).filter(field => {
      const column = apiRef.current.getColumn(field);
      return typeof column.preProcessEditCellProps === 'function';
    });

    if (fieldsWithValidator.length > 0) {
      const row = apiRef.current.getRow(id);
      const validatorErrors = fieldsWithValidator.map(async field => {
        const column = apiRef.current.getColumn(field);
        const newEditCellProps = await Promise.resolve(column.preProcessEditCellProps({
          id,
          row,
          props: editRowProps[field]
        }));
        apiRef.current.unstable_setEditCellProps({
          id,
          field,
          props: newEditCellProps
        });
        return newEditCellProps.error;
      });
      return Promise.all(validatorErrors).then(errors => {
        if (errors.some(error => !!error)) {
          return false;
        }

        apiRef.current.publishEvent('rowEditCommit', id, event);
        return true;
      });
    }

    apiRef.current.publishEvent('rowEditCommit', id, event);
    return true;
  }, [apiRef, props.editMode, props.experimentalFeatures?.preventCommitWhileValidating]);
  const setRowEditingEditCellValue = React.useCallback(params => {
    const model = apiRef.current.getEditRowsModel();
    const editRow = model[params.id];
    const row = apiRef.current.getRow(params.id);
    let isValid = true;
    return new Promise(resolve => {
      Object.keys(editRow).forEach(async field => {
        const column = apiRef.current.getColumn(field);
        let editCellProps = field === params.field ? {
          value: params.value
        } : editRow[field]; // setEditCellProps runs the value parser and returns the updated props

        editCellProps = apiRef.current.unstable_setEditCellProps({
          id: params.id,
          field,
          props: _extends({}, editCellProps, {
            isValidating: true
          })
        });

        if (column.preProcessEditCellProps) {
          editCellProps = await Promise.resolve(column.preProcessEditCellProps({
            id: params.id,
            row,
            props: _extends({}, editCellProps, {
              value: field === params.field ? apiRef.current.unstable_parseValue(params.id, field, params.value) : editCellProps.value
            })
          }));
        }

        if (editCellProps.error) {
          isValid = false;
        }

        apiRef.current.unstable_setEditCellProps({
          id: params.id,
          field,
          props: _extends({}, editCellProps, {
            isValidating: false
          })
        });
      });
      resolve(isValid);
    });
  }, [apiRef]);
  const rowEditingApi = {
    setRowMode,
    getRowMode,
    commitRowChange,
    unstable_setRowEditingEditCellValue: setRowEditingEditCellValue
  };
  useGridApiMethod(apiRef, rowEditingApi, 'EditRowApi');
  const handleCellKeyDown = React.useCallback(async (params, event) => {
    // Wait until IME is settled for Asian languages like Japanese and Chinese
    // TODO: `event.which` is depricated but this is a temporary workaround
    if (event.which === 229) {
      return;
    }

    const {
      cellMode,
      isEditable
    } = params;

    if (!isEditable) {
      return;
    }

    const isEditMode = cellMode === GridCellModes.Edit;
    const rowParams = apiRef.current.getRowParams(params.id);

    if (isEditMode) {
      if (event.key === 'Enter') {
        // TODO: check the return before firing 'rowEditStop'
        // On cell editing, it won't exits the edit mode with error
        const isValid = await apiRef.current.commitRowChange(params.id);

        if (!isValid && props.experimentalFeatures?.preventCommitWhileValidating) {
          return;
        }

        apiRef.current.publishEvent('rowEditStop', rowParams, event);
      } else if (event.key === 'Escape') {
        apiRef.current.publishEvent('rowEditStop', rowParams, event);
      }
    } else if (event.key === 'Enter') {
      apiRef.current.publishEvent('rowEditStart', rowParams, event);
    }
  }, [apiRef, props.experimentalFeatures?.preventCommitWhileValidating]);
  const handleCellDoubleClick = React.useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    const rowParams = apiRef.current.getRowParams(params.id);
    apiRef.current.publishEvent('rowEditStart', rowParams, event);
  }, [apiRef]);
  const handleEditCellPropsChange = React.useCallback(params => {
    const row = apiRef.current.getRow(params.id);
    const model = apiRef.current.getEditRowsModel();
    const editRow = model[params.id];
    Object.keys(editRow).forEach(async field => {
      const column = apiRef.current.getColumn(field);

      if (column.preProcessEditCellProps) {
        const editCellProps = field === params.field ? params.props : editRow[field];
        const newEditCellProps = await Promise.resolve(column.preProcessEditCellProps({
          id: params.id,
          row,
          props: editCellProps
        }));
        apiRef.current.unstable_setEditCellProps({
          id: params.id,
          field,
          props: newEditCellProps
        });
      } else if (field === params.field) {
        apiRef.current.unstable_setEditCellProps(params);
      }
    });
  }, [apiRef]);
  const handleRowEditStart = React.useCallback(params => {
    apiRef.current.setRowMode(params.id, GridRowModes.Edit);
  }, [apiRef]);
  const handleRowEditStop = React.useCallback((params, event) => {
    apiRef.current.setRowMode(params.id, GridRowModes.View);

    if (event.key === 'Enter') {
      apiRef.current.publishEvent('cellNavigationKeyDown', params, event);
    }
  }, [apiRef]);
  const handleRowEditCommit = React.useCallback(id => {
    const model = apiRef.current.getEditRowsModel();
    const editRow = model[id];

    if (!editRow) {
      throw new Error(`MUI: Row at id: ${id} is not being edited.`);
    }

    const row = apiRef.current.getRow(id);

    if (row) {
      let rowUpdate = _extends({}, row);

      Object.keys(editRow).forEach(field => {
        const column = apiRef.current.getColumn(field);
        const value = editRow[field].value;

        if (column.valueSetter) {
          rowUpdate = column.valueSetter({
            row: rowUpdate,
            value
          });
        } else {
          rowUpdate[field] = value;
        }
      });
      apiRef.current.updateRows([rowUpdate]);
    }
  }, [apiRef]);
  const handleCellFocusIn = React.useCallback(params => {
    nextFocusedCell.current = params;
  }, []);

  const commitPropsAndExit = async (params, event) => {
    if (params.cellMode === GridCellModes.View) {
      return;
    }

    nextFocusedCell.current = null;
    focusTimeout.current = setTimeout(async () => {
      if (nextFocusedCell.current?.id !== params.id) {
        await apiRef.current.commitRowChange(params.id, event);
        const rowParams = apiRef.current.getRowParams(params.id);
        apiRef.current.publishEvent('rowEditStop', rowParams, event);
      }
    });
  };

  const handleCellFocusOut = useEventCallback((params, event) => {
    commitPropsAndExit(params, event);
  });
  const handleColumnHeaderDragStart = useEventCallback(() => {
    const cell = gridFocusCellSelector(apiRef);

    if (!cell) {
      return;
    }

    const params = apiRef.current.getCellParams(cell.id, cell.field);
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