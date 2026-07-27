import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  if (!window.CSS) {
    (
      window as Window & {
        CSS: { supports: (property: string, value: string) => boolean };
      }
    ).CSS = {
      supports: () => false,
    };
  } else if (!window.CSS.supports) {
    window.CSS.supports = () => false;
  }
}
