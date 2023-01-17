/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetSelectedProductQuery,
  useDeleteProductMutation,
} from "../features/api";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { useAppDispatch } from "../app/hooks";
import Return from "../components/Return";

const Details = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: productData } = useGetSelectedProductQuery({
    id: id!,
  });
  const [deleteProduct, { data, isSuccess, isError }] =
    useDeleteProductMutation();

  const handleDelete = async () => {
    await deleteProduct({ id: id! });
    setShowModal(false);
    navigate("/home");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Produto deletado com sucesso");
      navigate("/home");
    } else if (isError) {
      toast.error("Não foi possível deletar o produto");
    }
  }, [isSuccess, navigate, isError, dispatch, data]);

  return (
    <>
      <div className="flex flex-col justify-center items-center md:h-screen max-w-2xl p-10 md:px-0 mx-auto gap-10">
        <div className="flex flex-col justify-between items-center gap-8 md:flex-row px-10 w-full">
          <h1 className="text-white text-5xl font-bold">{productData?.nome}</h1>
          <Return />
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-700 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-200 px-6 py-4 text-left"
              >
                Dados
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-200 px-6 py-4 text-left"
              >
                Produto
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 border-b border-gray-500">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Nome
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {productData?.nome}
              </td>
            </tr>
            <tr className="bg-gray-100 border-b border-gray-500">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Data de Fabricação
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {productData?.data_de_fabricacao}
              </td>
            </tr>
            <tr className="bg-gray-100 border-b border-gray-500">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Produto Perecível
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {productData?.produto_perecivel ? "Sim" : "Não"}
              </td>
            </tr>
            <tr className="bg-gray-100 border-b border-gray-500">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Data de Validade
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {productData?.data_de_validade ?? "Produto Não-perecível"}
              </td>
            </tr>
            <tr className="bg-gray-100 border-b border-gray-500">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Preço
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {productData?.preco}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row w-full gap-8 ">
          <Button
            secondary
            title="Deletar Produto"
            onClick={() => setShowModal(true)}
          />
          <Link to={`/update/${id}`} className="w-full">
            <Button title="Atualizar Produto" />
          </Link>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-10 md:px-0">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Deletar Produto</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Você tem certeza que deseja deletar o produto?
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Sair
                  </button>
                  <button
                    className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleDelete}
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Details;
