import type { Metadata } from "next";
import { Providers } from "@/store/Providers";
import "./globals.css";
import ThemeClientWrapper from "@/providers/ThemeClientWrapper";
import Header from "@/components/Header";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Event Manager",
  description: "Sistema de Gestão de Eventos",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
      <ReactQueryProvider>

        <Providers>
        <ThemeClientWrapper>
          <Header/>
          <main>{children}</main>
          </ThemeClientWrapper>
        </Providers>
        </ReactQueryProvider>

      </body>
    </html>
  );
}
