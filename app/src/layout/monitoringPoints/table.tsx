import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useLayoutEffect, useState } from "react";
import {
  IMonitoringPoint,
  IMonitoringPointStore,
} from "../../redux/store/monitoringPoints/types";

interface ITableProps {
  monitoringPoints: IMonitoringPointStore[];
  total: number;
}

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    sortable: true,
    width: 70,
  },
  {
    field: "machName",
    headerName: "Máquina",
    sortable: true,
    width: 130,
  },
  {
    field: "machType",
    headerName: "Tipo Máquina",
    sortable: true,
    width: 130,
  },
  {
    field: "pointName",
    headerName: "Ponto Monitoramento",
    sortable: true,
    width: 90,
  },
  {
    field: "sensor",
    headerName: "Sensor",
    sortable: true,
    width: 160,
  },
];

export default function PointsTable({ monitoringPoints }: ITableProps) {
  const [rows, setRows] = useState<any[]>([]);

  useLayoutEffect(() => {
    const rowsTable: any[] = [];

    monitoringPoints.forEach((mach: IMonitoringPointStore) => {
      mach.monitoring_points.map((point: IMonitoringPoint) => {
        console.log({ point, mach });
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
  }, [monitoringPoints]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
