'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
  GridSlots,
  gridEditRowsStateSelector,
  useGridSelector,
  useGridApiContext,
  GridActionsCell,
  GridRenderCellParams,
  GridActionsCellItem,
} from '@mui/x-data-grid';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = '000';
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

function ActionsCell(props: GridRenderCellParams) {
    const apiRef = useGridApiContext();
    const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);
    const isInEditMode = rowModesModel[props.id] !== undefined;
  
    const { handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick } =
      React.useContext(ActionHandlersContext);
  
    return (
      <GridActionsCell {...props}>
        {isInEditMode ? (
          <React.Fragment>
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{ sx: { color: 'primary.main' } }}
              onClick={() => handleSaveClick(props.id)}
            />
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => handleCancelClick(props.id)}
              color="inherit"
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => handleEditClick(props.id)}
              color="inherit"
            />
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(props.id)}
              color="inherit"
            />
          </React.Fragment>
        )}
      </GridActionsCell>
    );
  }

interface ActionHandlers {
  handleCancelClick: (id: GridRowId) => void;
  handleDeleteClick: (id: GridRowId) => void;
  handleEditClick: (id: GridRowId) => void;
  handleSaveClick: (id: GridRowId) => void;
}

const ActionHandlersContext = React.createContext<ActionHandlers>({
  handleCancelClick: () => {},
  handleDeleteClick: () => {},
  handleEditClick: () => {},
  handleSaveClick: () => {},
});

const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

interface InteractiveTableProps {
    columns: GridColDef[];
    columnsCount: number;
    initialRows?: GridRowsProp;
  }

export function InteractiveTable({columns, columnsCount, initialRows = []}: InteractiveTableProps) {
    if (columns.length == columnsCount) {
        columns.push({
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <ActionsCell {...params} />,
        });
    }
  const [rows, setRows] = React.useState(initialRows);
  const [paginationModel, setPaginationModel] = React.useState({ pageSize: 5, page: 0 });
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const actionHandlers = React.useMemo<ActionHandlers>(
    () => ({
      handleEditClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.Edit },
        }));
      },
      handleSaveClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View },
        }));
      },
      handleDeleteClick: (id: GridRowId) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      },
      handleCancelClick: (id: GridRowId) => {
        setRowModesModel((prevRowModesModel) => {
          return {
            ...prevRowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          };
        });

        setRows((prevRows) => {
          const editedRow = prevRows.find((row) => row.id === id);
          if (editedRow!.isNew) {
            return prevRows.filter((row) => row.id !== id);
          }
          return prevRows;
        });
      },
    }),
    [],
  );

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    return updatedRow;
  };

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <ActionHandlersContext.Provider value={actionHandlers}>
        <DataGrid
          rows={rows}
          pagination={true}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
                paginationModel: paginationModel,
              },
            }
          }
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          showToolbar
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </ActionHandlersContext.Provider>
    </Box>
  );
}