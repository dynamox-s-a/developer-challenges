import { ProtectedRoute } from "../../features/security/ProtectedRoute";
import { CriarProduto } from "../../features/products/CriarProduto";

export function CriarProdutoPage() {
  return (
    <ProtectedRoute>
      <CriarProduto></CriarProduto>
    </ProtectedRoute>
  );
}
