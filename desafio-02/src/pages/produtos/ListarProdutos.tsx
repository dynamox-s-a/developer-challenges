import { ListarProdutos } from "../../features/products/ListarProdutos";
import { ProtectedRoute } from "../../features/security/ProtectedRoute";

export function ListarProdutosPage() {
  return (
    <ProtectedRoute>
      <ListarProdutos></ListarProdutos>
    </ProtectedRoute>
  );
}
