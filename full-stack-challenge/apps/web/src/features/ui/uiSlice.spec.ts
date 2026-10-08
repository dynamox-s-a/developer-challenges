import {
  COLOR_MODE_STORAGE_KEY,
  colorModeSet,
  colorModeToggled,
  persistColorMode,
  readInitialColorMode,
  uiReducer,
} from './uiSlice';

function mockPrefersDark(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches, media: query })),
  );
}

describe('uiSlice', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('readInitialColorMode', () => {
    it('prefers the stored choice over the OS preference', () => {
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
      mockPrefersDark(true);
      expect(readInitialColorMode()).toBe('light');
    });

    it('falls back to the OS preference', () => {
      mockPrefersDark(true);
      expect(readInitialColorMode()).toBe('dark');
      mockPrefersDark(false);
      expect(readInitialColorMode()).toBe('light');
    });

    it('ignores a stored value that is not a colour mode', () => {
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'purple');
      mockPrefersDark(true);
      expect(readInitialColorMode()).toBe('dark');
    });

    it('uses the OS preference when storage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      mockPrefersDark(true);
      expect(readInitialColorMode()).toBe('dark');
    });

    it('defaults to light without matchMedia', () => {
      vi.stubGlobal('matchMedia', undefined);
      expect(readInitialColorMode()).toBe('light');
    });
  });

  describe('persistColorMode', () => {
    it('stores the choice', () => {
      persistColorMode('dark');
      expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
    });

    it('swallows storage errors', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => persistColorMode('dark')).not.toThrow();
    });
  });

  describe('reducer', () => {
    it('starts from the initial colour mode', () => {
      mockPrefersDark(true);
      expect(uiReducer(undefined, { type: 'init' })).toEqual({
        colorMode: 'dark',
      });
    });

    it('toggles between light and dark', () => {
      const dark = uiReducer({ colorMode: 'light' }, colorModeToggled());
      expect(dark.colorMode).toBe('dark');
      expect(uiReducer(dark, colorModeToggled()).colorMode).toBe('light');
    });

    it('sets an explicit mode', () => {
      expect(
        uiReducer({ colorMode: 'light' }, colorModeSet('dark')).colorMode,
      ).toBe('dark');
    });
  });
});
