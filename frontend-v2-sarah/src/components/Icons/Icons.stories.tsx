import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { DynamicRangeIcon } from './DynamicRangeIcon';
import { GpsIcon } from './GpsIcon';
import { IntervalIcon } from './IntervalIcon';
import { MachineIcon } from './MachineIcon';
import { RpmIcon } from './RpmIcon';

const icons = [
  { name: 'DynamicRangeIcon', Component: DynamicRangeIcon },
  { name: 'GpsIcon', Component: GpsIcon },
  { name: 'IntervalIcon', Component: IntervalIcon },
  { name: 'MachineIcon', Component: MachineIcon },
  { name: 'RpmIcon', Component: RpmIcon },
];

const IconGallery = ({ size }: { size: number }) => (
  <Box p={3}>
    <Typography variant="h5">Catálogo de Ícones</Typography>
    <Typography variant="body2">
      Todos os ícones suportam a propriedade "size"
    </Typography>

    <Grid container spacing={3} sx={{ mt: 2 }}>
      {icons.map(({ name, Component }, index) => (
        <Grid item xs={6} sm={4} md={3} key={`${name}-${index}`}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              height: '120px',
              textAlign: 'center',
            }}
          >
            <Component size={size} />
            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
              {name}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const meta: Meta<typeof IconGallery> = {
  title: 'Components/Icons',
  component: IconGallery,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      description: 'Tamanho padrão dos ícones em pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const Gallery: Story = {
  args: {
    size: 24, // tamanho padrão
  },
};
