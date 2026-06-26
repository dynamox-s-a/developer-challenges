import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import DashboardPage from '../pages/DashBoardPage';
import { ThemeContextProvider } from '../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ThemeContextProvider>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </ThemeContextProvider>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página principal do dashboard. Exibe o header, 3 gráficos (Aceleração RMS, Velocidade RMS, Temperatura) com crosshair sincronizado.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardPage>;

export const Default: Story = {};