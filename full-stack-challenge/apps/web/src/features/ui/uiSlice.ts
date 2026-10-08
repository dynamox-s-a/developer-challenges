import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColorMode = 'light' | 'dark';

export const COLOR_MODE_STORAGE_KEY = 'dynapredict.colorMode';

export interface UiState {
  colorMode: ColorMode;
}

function isColorMode(value: unknown): value is ColorMode {
  return value === 'light' || value === 'dark';
}

/**
 * The user's stored choice, else the OS preference, else light. Storage can
 * throw (private mode, blocked site data), which falls through to the OS.
 */
export function readInitialColorMode(): ColorMode {
  try {
    const stored = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (isColorMode(stored)) return stored;
  } catch {
    // Storage unavailable: use the OS preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Remembers an explicit choice; a failed write only costs persistence. */
export function persistColorMode(mode: ColorMode): void {
  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    // Storage unavailable: the choice lasts until reload.
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: (): UiState => ({ colorMode: readInitialColorMode() }),
  reducers: {
    colorModeToggled(state) {
      state.colorMode = state.colorMode === 'light' ? 'dark' : 'light';
    },
    colorModeSet(state, action: PayloadAction<ColorMode>) {
      state.colorMode = action.payload;
    },
  },
});

export const { colorModeToggled, colorModeSet } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
