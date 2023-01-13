import { EditarProduto } from "../../features/products/EditarProduto";
import { ProtectedRoute } from "../../features/security/ProtectedRoute";

export function EditarProdutoPage() {
  return (
    <ProtectedRoute>
      <EditarProduto></EditarProduto>
    </ProtectedRoute>
  );
}
