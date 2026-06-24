import type { Meta, StoryObj } from '@storybook/react-vite'
import { machineMock } from '../../../../modules/machine/machineMock'
import { MachineMetadataBar } from '.'
import {
  GPSIcon,
  IntervalIcon,
  MachineIcon,
  RPMIcon,
  RangeIcon,
} from './MetadataIcons'

const defaultItems = [
  { icon: MachineIcon, label: `Máquina ${machineMock.id}` },
  { icon: GPSIcon, label: `Ponto ${machineMock.point}` },
  { icon: RPMIcon, label: machineMock.rotation },
  { icon: RangeIcon, label: `${machineMock.range}g` },
  { icon: IntervalIcon, label: `${machineMock.interval} min` },
]

const meta = {
  argTypes: {
    items: {
      control: 'object',
    },
  },
  component: MachineMetadataBar,
  title: 'Data/MachineMetadataBar',
} satisfies Meta<typeof MachineMetadataBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: defaultItems,
  },
}

export const MissingValues: Story = {
  args: {
    items: [
      { icon: MachineIcon, label: 'Máquina -' },
      { icon: GPSIcon, label: 'Ponto -' },
      { icon: RPMIcon, label: '-' },
      { icon: RangeIcon, label: '-' },
      { icon: IntervalIcon, label: '-' },
    ],
  },
}
