import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { store } from './app/store';
import { theme } from './theme';

function renderApp() {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
  );
}

describe('App', () => {
  it('renders the dashboard title', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /dynamox dashboard/i })).toBeInTheDocument();
  });
});
