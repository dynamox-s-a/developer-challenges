import { colorModeSet, COLOR_MODE_STORAGE_KEY } from '../features/ui/uiSlice';
import { setupStore } from './store';

describe('setupStore', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('starts from a preloaded state', () => {
    const store = setupStore({ ui: { colorMode: 'dark' } });
    expect(store.getState().ui.colorMode).toBe('dark');
  });

  it('persists the colour mode when it changes', () => {
    const store = setupStore({ ui: { colorMode: 'light' } });
    store.dispatch(colorModeSet('dark'));
    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
  });

  it('does not write storage for actions that keep the mode', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const store = setupStore({ ui: { colorMode: 'light' } });
    store.dispatch(colorModeSet('light'));
    store.dispatch({ type: 'unrelated/action' });
    expect(setItem).not.toHaveBeenCalled();
  });
});
