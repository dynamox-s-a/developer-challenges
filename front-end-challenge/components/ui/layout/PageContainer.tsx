import { PropsWithChildren } from "react";
import AppContainer from "./AppContainer";

/**
 * @deprecated Use AppContainer instead with maxWidth: 800
 * Mantido para compatibilidade, mas recomenda-se migrar para AppContainer
 */
export default function PageContainer({ children }: PropsWithChildren) {
  return <AppContainer maxWidth={800}>{children}</AppContainer>;
}
