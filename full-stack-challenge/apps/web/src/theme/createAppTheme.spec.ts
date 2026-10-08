import { getContrastRatio } from '@mui/material/styles';
import { createAppTheme } from './createAppTheme';

describe('createAppTheme', () => {
  it.each(['light', 'dark'] as const)('builds the %s palette', (mode) => {
    expect(createAppTheme(mode).palette.mode).toBe(mode);
  });

  it.each(['light', 'dark'] as const)(
    'keeps chart series visible (3:1 graphics contrast) in %s mode',
    (mode) => {
      const { palette } = createAppTheme(mode);
      for (const series of [palette.chart.readings, palette.chart.forecast]) {
        expect(
          getContrastRatio(series, palette.background.paper),
        ).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it.each(['light', 'dark'] as const)(
    'keeps text readable (WCAG AA) in %s mode',
    (mode) => {
      const { palette } = createAppTheme(mode);
      const pairs: Array<[string, string]> = [
        [palette.text.primary, palette.background.default],
        [palette.text.primary, palette.background.paper],
        [palette.text.secondary, palette.background.paper],
        [palette.primary.contrastText, palette.primary.main],
        [palette.secondary.contrastText, palette.secondary.main],
        // Text-coloured buttons (Delete, Remove sensor) on cards.
        [palette.error.main, palette.background.paper],
      ];
      for (const [foreground, background] of pairs) {
        expect(getContrastRatio(foreground, background)).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    },
  );
});
