import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { store } from './store/store';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = renderWithProviders(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should show login when not authenticated', () => {
    const { getByText } = renderWithProviders(<App />);
    expect(getByText('Sign in')).toBeTruthy();
  });
});
