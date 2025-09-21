import { ReactNode } from "react";
import { ThemeProviderWrapper } from "./ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ThemeProviderWrapper>{children}</ThemeProviderWrapper>;
}
