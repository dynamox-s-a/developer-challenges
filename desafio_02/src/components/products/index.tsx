import React, { useEffect } from "react";
import { fetchAllProducts } from "../../redux/reducers/products";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import ProductsTable from "./productTable";

export default function Produtcs(): JSX.Element {
  const { products, loading } = useAppSelector((state) => state.productsSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchAllProducts());
  }, []);

  return (
    <section>
      {loading && <h1>Carregando...</h1>}
      {products.length === 0 && !loading && <h1> Sem Produtos</h1>}
      {products.length > 0 && <ProductsTable products={products} />}
    </section>
  );
}
