import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from './app';
import { store } from './store';

// Renderiza o App como se o navegador estivesse na URL "path"
function renderApp(path: string) {
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </Provider>,
  );
}

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderApp('/machines');
    expect(baseElement).toBeTruthy();
  });

  it('should redirect "/" to the machines page', async () => {
    renderApp('/');
    expect(
      await screen.findByRole('heading', { name: 'Máquinas' }),
    ).toBeTruthy();
  });

  it('should open the monitoring points page', () => {
    renderApp('/monitoring-points');
    expect(
      screen.getByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });

  it('should navigate using the side menu', async () => {
    renderApp('/machines');

    // O menu existe duas vezes (celular e computador): clicamos no primeiro
    const [link] = screen.getAllByRole('link', {
      name: 'Pontos de monitoramento',
      hidden: true,
    });
    fireEvent.click(link);

    expect(
      await screen.findByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });
});
