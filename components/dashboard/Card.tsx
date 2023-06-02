import * as React from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface CardProps {
  name: string;
  machineName: string;
  machineType: string;
  sensorName: string;
  sensorModel: string;
}

export default function Card(props: CardProps) {
  return (
    <React.Fragment>
      <Grid item sx={{ display: "flex", flexWrap: "wrap" }}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              {props.name}
            </Typography>

            <Typography variant="body2">
              Máquina: {props.machineName} | {props.machineType}
            </Typography>
            <Typography variant="body2">
              Sensor: {props.sensorName} | {props.sensorModel}
            </Typography>
          </CardContent>
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
