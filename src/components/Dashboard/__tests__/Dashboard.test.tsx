import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

const mockStore = configureMockStore();
const store = mockStore({
  data: [],
  loading: false,
});

describe('<Dashboard />', () => {
  it('should renders the Dashboard with all charts', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    );

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Aceleração RMS/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperatura/i)).toBeInTheDocument();
    expect(screen.getByText(/Velocidade RMS/i)).toBeInTheDocument();
  });
});
