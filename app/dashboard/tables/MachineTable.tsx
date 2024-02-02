import { selectMachines, useSelector } from "@/lib/redux";
import { Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "Machine Name", width: 200 },
  { field: "type", headerName: "Machine Type", width: 200 },
];

export default function MachineTable() {
  const { status, data } = useSelector(selectMachines);

  if (status === "loading") {
    return (
      <div style={{ width: "100%" }}>
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
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
        rows={data}
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
