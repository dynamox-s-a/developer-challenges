"use client";

import { ThemeProviderCustom } from "@/context/ThemeContext";
import ThemeRegistry from "@/providers/ThemeRegistry";

export default function ThemeClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <ThemeProviderCustom>{children}</ThemeProviderCustom>
    </ThemeRegistry>
  );
}
