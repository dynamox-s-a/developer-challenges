import { useEffect, useState } from "react";
import { Box, Typography, Pagination } from "@mui/material";
import { getMachines } from "../../services/machineService";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  fetchMonitoringPoints,
  setPage,
  setSort,
} from "../../redux/monitoringPointsSlice";
import MonitoringPointTable from "../../components/table/MonitoringPointsTable";
import MonitoringPointForm from "../../components/form/MonitoringPointForm";
import { Machine } from "../../types/monitoringPoint";

export default function Points() {
  const dispatch = useAppDispatch();
  const { points, sortBy, order, page, total } = useAppSelector(
    (state) => state.monitoringPoints
  );

  const [machines, setMachines] = useState<Machine[]>([]);

  const fetchMachines = async () => {
    try {
      const res = await getMachines();
      setMachines(res.data);
    } catch (err) {
      console.error("Error when searching for machines", err);
    }
  };

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch, page, sortBy, order]);

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSortChange = (field: string) => {
    dispatch(setSort(field));
  };

  return (
    <Box
      p={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 6,
        gap: 4,
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Monitoring Points
      </Typography>

      <MonitoringPointForm machines={machines} />

      <MonitoringPointTable
        data={points}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
      />

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(total / 5) || 1}
          page={page}
          onChange={(_e, val) => dispatch(setPage(val))}
        />
      </Box>
    </Box>
  );
}
