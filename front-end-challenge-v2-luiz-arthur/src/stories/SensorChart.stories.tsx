import type { Meta, StoryObj } from '@storybook/react';
import SensorChart from '../components/SensorChart';

// Dados mockados
const mockData = [
  { datetime: '2023-11-07T11:53:38.187Z', max: 0.1 },
  { datetime: '2023-11-08T11:53:38.187Z', max: 0.2 },
  { datetime: '2023-11-09T11:53:38.187Z', max: 0.15 },
  { datetime: '2023-11-10T11:53:38.187Z', max: 0.25 },
];

const meta: Meta<typeof SensorChart> = {
  title: 'Components/SensorChart',
  component: SensorChart,
  tags: ['autodocs'],
  argTypes: {
    yAxisTitle: {
      control: 'text',
      description: 'Título do eixo Y',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SensorChart>;

export const Acceleration: Story = {
  args: {
    title: 'Aceleração RMS',
    series: [
      { name: 'Horizontal', data: mockData, color: '#1976d2' },
      { name: 'Radial', data: mockData.map(p => ({ ...p, max: p.max * 1.5 })), color: '#d32f2f' },
      { name: 'Axial', data: mockData.map(p => ({ ...p, max: p.max * 0.8 })), color: '#2e7d32' },
    ],
    yAxisTitle: 'Aceleração RMS (g)',
  },
};

export const Velocity: Story = {
  args: {
    title: 'Velocidade RMS',
    series: [
      { name: 'Horizontal', data: mockData.map(p => ({ ...p, max: p.max * 10 })), color: '#1976d2' },
      { name: 'Radial', data: mockData.map(p => ({ ...p, max: p.max * 15 })), color: '#d32f2f' },
      { name: 'Axial', data: mockData.map(p => ({ ...p, max: p.max * 8 })), color: '#2e7d32' },
    ],
    yAxisTitle: 'Velocidade RMS (mm/s)',
  },
};

export const Temperature: Story = {
  args: {
    title: 'Temperatura',
    series: [
      { name: 'Temperatura', data: mockData.map(p => ({ ...p, max: p.max * 100 + 20 })), color: '#ed6c02' },
    ],
    yAxisTitle: 'Temperatura (°C)',
  },
};