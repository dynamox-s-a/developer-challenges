import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { TimeSeriesCount } from './time-series-count';

function renderCount() {
  render(
    <Provider store={setupStore()}>
      <TimeSeriesCount />
    </Provider>,
  );
}

describe('TimeSeriesCount', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show how many series are stored, in the brazilian format', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { count: 12345 } });
    renderCount();

    expect(
      await screen.findByText('Séries temporais armazenadas: 12.345'),
    ).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/time-series/count', {
      signal: expect.any(AbortSignal),
    });
  });

  it('should show nothing while the number has not arrived', () => {
    // Uma API que ainda não respondeu
    vi.spyOn(api, 'get').mockReturnValue(new Promise(() => undefined));
    renderCount();

    expect(screen.queryByText(/Séries temporais armazenadas/)).toBeNull();
  });
});
