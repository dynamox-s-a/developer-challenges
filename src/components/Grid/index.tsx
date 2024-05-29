import { Box, Grid, Typography } from '@mui/material';

interface GridItemProps {
  text: string;
  icon?: string;
}

function GridItem({ text, icon }: GridItemProps) {
  return (
    <>
      <Grid item xs={12} sm={6} md>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
          <img src={icon} aria-label={text} title={text} />
          <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{text}</Typography>
        </Box>
      </Grid>
    </>
  );
}

export default GridItem;
