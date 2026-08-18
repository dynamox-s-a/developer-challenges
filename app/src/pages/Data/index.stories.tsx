import type { Meta, StoryObj } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DataPage from './index';
import type { Data } from '../../types/data';

const baseTimestamp = new Date('2026-01-01T00:00:00Z').getTime();

function buildPoints(seed: number) {
  return Array.from({ length: 12 }, (_, index) => ({
    datetime: new Date(baseTimestamp + index * 24 * 60 * 60 * 1000).toISOString(),
    max: Number((seed + Math.sin(index / 2) * 0.2 + index * 0.03).toFixed(3)),
  }));
}

const mockedData: Data[] = [
  { name: 'Aceleração X', data: buildPoints(1.1) },
  { name: 'Aceleração Y', data: buildPoints(1.3) },
  { name: 'Aceleração Z', data: buildPoints(1.2) },
  { name: 'Velocidade X', data: buildPoints(0.7) },
  { name: 'Velocidade Y', data: buildPoints(0.8) },
  { name: 'Velocidade Z', data: buildPoints(0.9) },
  { name: 'Temperatura', data: buildPoints(25) },
];

type MockDataState = {
  data: Data[];
  loading: boolean;
  error: string | null;
};

function createStore(initialDataState: MockDataState) {
  return configureStore({
    reducer: {
      data: () => initialDataState,
    },
  });
}

const meta = {
  title: 'Pages/Data',
  component: DataPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      const dataState = (context.parameters.dataState as MockDataState | undefined) ?? {
        data: mockedData,
        loading: false,
        error: null,
      };
      const store = createStore(dataState);

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} satisfies Meta<typeof DataPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    dataState: {
      data: [],
      loading: true,
      error: null,
    } satisfies MockDataState,
  },
};

export const Error: Story = {
  parameters: {
    dataState: {
      data: [],
      loading: false,
      error: 'Falha ao carregar dados',
    } satisfies MockDataState,
  },
};

export const EmptyState: Story = {
  parameters: {
    dataState: {
      data: [],
      loading: false,
      error: null,
    } satisfies MockDataState,
  },
};
