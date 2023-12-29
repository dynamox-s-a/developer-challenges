import { Box, Grid, SvgIcon, Typography } from '@mui/material';
import CycleTimeIcon from '@/assets/cycleTimeIcon';
import EngineIcon from '@/assets/engineIcon';
import FrequencyIcon from '@/assets/frequencyIcon';
import RPMIcon from '@/assets/rpmIcon';
import TargetIcon from '@/assets/targetIcon';
import { ReactNode } from 'react';

type TItem = {
  icon: ReactNode;
  title?: string;
  value?: number | string;
  xs: number;
  hideDivisor?: boolean;
};

const InfoCard = () => {
  const RenderItem = ({
    hideDivisor = false,
    icon,
    title,
    value,
    xs,
  }: TItem) => {
    const borderRight = !hideDivisor ? '1px solid #ddd' : 'none';
    return (
      <Grid
        item
        key={title}
        sx={{ lineHeight: '20px', padding: '24px' }}
        xs={xs}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            borderRight: { borderRight },
          }}
        >
          <Box sx={{ marginRight: '12px', alignSelf: 'center' }}>
            {icon ?? <SvgIcon>{icon}</SvgIcon>}
          </Box>
          <Typography>{title}</Typography>
          <Typography sx={{ marginLeft: '12px' }}>{value}</Typography>
        </Box>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        border: '1px solid #dfe3e8',
        margin: '24px 24px',
        padding: '12px 24px',
        height: '46px',
        backgroundColor: '#fff',
      }}
    >
      <Grid container spacing={2}>
        <RenderItem title="Máquina" icon={<EngineIcon />} value="1023" xs={3} />
        <RenderItem title="Ponto" icon={<TargetIcon />} value="20192" xs={3} />
        <RenderItem icon={<RPMIcon />} value="200" xs={2} />
        <RenderItem icon={<FrequencyIcon />} value="16g" xs={2} />
        <RenderItem hideDivisor icon={<CycleTimeIcon />} value="20min" xs={2} />
      </Grid>
    </Box>
  );
};

export default InfoCard;
