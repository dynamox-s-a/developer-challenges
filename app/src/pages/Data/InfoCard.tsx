import { Card, Grid, Typography } from '@mui/material';

const InfoCard = () => {
  return (
    <Card sx={{ margin: '24px 0px' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography>Máquina</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Ponto</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>RPM 200</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Duração 16g</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>Voltas 20min</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default InfoCard;
