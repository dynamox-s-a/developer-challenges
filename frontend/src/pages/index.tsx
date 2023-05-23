import { Grid, ListItemIcon } from '@mui/material'
import Image from 'next/image'
import Router from 'next/router'
import { HourglassEmpty } from "@mui/icons-material";

export default function Home() {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <ListItemIcon>
          <HourglassEmpty></HourglassEmpty>
        </ListItemIcon>
      </Grid>
    </Grid>
  )
}