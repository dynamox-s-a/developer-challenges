import React, { FC } from "react";
import { ResponseProductType } from "../types";

export type IProductsCardProps = ResponseProductType;

const ProductCard: FC<IProductsCardProps> = ({
  data_de_fabricacao,
  nome,
  preco,
  produto_perecivel,
  data_de_validade,
}) => {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-gray-200">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{nome}</div>
        <p className="text-gray-700 text-base">{data_de_fabricacao}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="font-bold text-xl mb-2">Produto Perecível?</div>
        <p className="text-gray-700 text-base">
          {produto_perecivel ? "Sim" : "Não"}
        </p>
      </div>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {preco}
      </span>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {data_de_validade ?? "Produto não Perecível"}
      </span>
    </div>
  );
};

export default ProductCard;
