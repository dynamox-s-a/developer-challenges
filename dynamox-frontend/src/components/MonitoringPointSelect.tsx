import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonitoringPoints } from "../store/monitoring-point/monitoringPointThunks";
import { RootState, AppDispatch } from "../store";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const MonitoringPointSelect: React.FC<Props> = ({ value, onChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.monitoringPoints);

  useEffect(() => {
    dispatch(fetchMonitoringPoints());
  }, [dispatch]);

  return (
    <FormControl fullWidth>
      <InputLabel id="monitoring-point-label">Ponto de Monitoramento</InputLabel>
      <Select<number>
        labelId="monitoring-point-label"
        value={value}
        label="Ponto de Monitoramento"
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={loading}
      >
        {items.map((point: any) => (
          <MenuItem key={point.id} value={point.id}>
            {point.name} ({point.machine.name})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonitoringPointSelect;
