import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Data from './index';

const store = configureStore({
  reducer: {
    data: (state = { data: [] }) => state,
  },
});

describe('Data page', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Data />
        </MemoryRouter>
      </Provider>,
    );

    expect(container.firstChild).toBeTruthy();
  });
});
