import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  gridClasses,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { SetStateAction, useLayoutEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  IListPoint,
  IMonitoringPoint,
} from "../../redux/store/monitoringPoints/types";
import { AppDispatch } from "../../redux/store";

interface ITableProps {
  machinesPoints: IMonitoringPoint[];
  listPoints: IListPoint[];
}

export default function PointsTable({
  machinesPoints,
  listPoints,
}: ITableProps) {
  const [rows, setRows] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [modalType, setModalType] = useState<string>("edit");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const formHook = useForm<IListPoint>();
  const [listPointId, setListPointId] = useState<number | undefined>();

  const openModal = (type: string, id?: GridRowId) => {
    if (type === "edit" && id) {
      const point = listPoints.filter((pt) => pt.id === id)[0];
      formHook.setValue("name", point.name);
      formHook.setValue("machineId", point.machineId);
      formHook.setValue("sensor", point.sensor);

      setListPointId(point.id);
    }
    setModalIsOpen(true);
    setModalType(type);
  };

  useLayoutEffect(() => {
    const rowsTable: any[] = [];

    machinesPoints.forEach((mach: IMonitoringPoint) => {
      mach.monitoring_points.map((point: IListPoint) => {
        rowsTable.push({
          id: point.id,
          machName: mach.name,
          machType: mach.type,
          pointName: point.name,
          sensor: point.sensor,
        });
      });
    });

    console.log({ rowsTable });

    setRows(rowsTable);
  }, [machinesPoints]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      sortable: true,
      width: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "machName",
      headerName: "Máquina",
      sortable: true,
      width: 200,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "machType",
      headerName: "Tipo Máquina",
      width: 200,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "pointName",
      headerName: "Ponto Monitoramento",
      sortable: true,
      width: 220,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "sensor",
      headerName: "Sensor",
      sortable: true,
      width: 140,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 80,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      getActions: (point) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Delete"
          onClick={() => openModal("edit", point.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Toggle Admin"
          onClick={() => openModal("delete", point.id)}
        />,
      ],
    },
  ];

  return (
    <>
      <Box
        sx={{
          "& .super-app-theme--header": {
            backgroundColor: "#263252",
            color: "#F4F7FC",
          },
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
            {
              outline: "none",
            },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: "none",
            },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
        />
      </Box>
      <Tooltip title="Adicionar Máquina">
        <Fab
          size="large"
          sx={{ position: "absolute", bottom: 0, right: 16 }}
          color="primary"
          aria-label="Adicionar Máquina"
          onClick={() => openModal("create")}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
}
