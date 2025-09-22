import { ThemeProviderWrapper } from "./ThemeProvider";
import type { ProvidersProps } from "../types/ui";

export function Providers({ children }: ProvidersProps) {
  return <ThemeProviderWrapper>{children}</ThemeProviderWrapper>;
}
