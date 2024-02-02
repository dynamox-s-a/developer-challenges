import { selectMonitoringPoints, useSelector } from "@/lib/redux";
import { Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "Monitoring Point", width: 200 },
  { field: "machineName", headerName: "Machine Name", width: 200 },
  { field: "machineType", headerName: "Machine Type", width: 200 },
  { field: "sensor", headerName: "Sensor", width: 200 },
];

export default function MonitoringPointTable() {
  const { status, data } = useSelector(selectMonitoringPoints);

  const rows = data.map((monitoringPoint) => {
    return {
      id: monitoringPoint?.id,
      name: monitoringPoint?.name,
      machineName: monitoringPoint?.machine?.name,
      machineType: monitoringPoint?.machine?.type,
      sensor: monitoringPoint?.sensor?.model,
    };
  });

  if (status === "loading") {
    return (
      <div style={{ width: "100%" }}>
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
      </div>
    );
  }

  if (status === "error") {
    return <div style={{ height: 400, width: "100%" }}>Ocorreu um erro ao caregar os dados.</div>;
  }

  return (
    <div style={{ width: "100%", marginTop: 10 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
