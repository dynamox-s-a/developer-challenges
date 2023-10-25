/* Components */
import { Providers } from "@/lib/providers";

/* Instruments */
import "./styles/globals.css";

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <Providers>
      <html lang="pt-br">
        <head>
          <meta
            name="description"
            content="A Dynamox é a sua parceira tecnológica em manutenção preditiva. Temos a solução completa de monitoramento que coleta de dados de vibração e temperatura, possibilitando antecipar falhas e evitar interrupções nos ativos."
          />
          <meta
            name="keywords"
            content="manutenção preditiva,sensor de vibração,sensor de temperatura,sensor de manutenção,gestão da manutenção,manutenção"
          />
        </head>
        <body>
          <section>
            <main>{props.children}</main>
          </section>
        </body>
      </html>
    </Providers>
  );
}

export const metadata = {
  title: "Dynamox",
};
