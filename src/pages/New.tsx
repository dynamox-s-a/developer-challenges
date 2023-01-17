import React, { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import { usePostProductMutation } from "../features/api";
import { ResponseProductType } from "../types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mascaraMoeda } from "../utils/convertInputReal";
import { v4 as uuidv4 } from "uuid";
import Return from "../components/Return";

const New = () => {
  const navigate = useNavigate();
  const [isPerecivel, setIsPerecivel] = useState("false");
  const { register, handleSubmit } = useForm<ResponseProductType>();
  const [data, { isSuccess, isError }] = usePostProductMutation();
  const onSubmit: SubmitHandler<ResponseProductType> = async ({
    nome,
    preco,
    data_de_fabricacao,
    produto_perecivel,
    data_de_validade,
  }) => {
    if (!nome || !preco || !data_de_fabricacao || !produto_perecivel) {
      return toast.error("Por Favor preencha todas as informações pedidas");
    }
    if (data_de_validade) {
      if (data_de_fabricacao >= data_de_validade) {
        return toast.error(
          "A Data de Validade não pode ser menor que a data de fabricação"
        );
      }
    }
    return await data({
      id: uuidv4(),
      nome,
      preco,
      data_de_fabricacao: data_de_fabricacao?.split("-").reverse().join("/"),
      produto_perecivel: isPerecivel === "true" ? true : false,
      data_de_validade: data_de_validade?.split("-").reverse().join("/"),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Produto Adicionado com Sucesso");
      navigate("/home");
    } else if (isError) {
      toast.error("Não conseguimos adicionar o produto");
    }
  }, [isSuccess, navigate, isError, data]);

  return (
    <div className="flex flex-col justify-center items-center md:h-screen gap-8 p-10 md:px-0">
      <div className="flex flex-col justify-between max-w-4xl gap-8">
        <h1 className="text-white text-4xl font-bold">
          Digite as Informações do Produto
        </h1>
        <Return />
      </div>
      <div className="w-full max-w-md p-6 space-y-4 bg-gray-900 rounded">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Nome
            </label>
            <input
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              type="text"
              placeholder="Nome"
              id="nome"
              {...register("nome")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white">
              Preço
            </label>
            <input
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              id="preco"
              placeholder="Digite o preço"
              onInput={(event) => mascaraMoeda(event)}
              {...register("preco")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Data de Fabricação
            </label>
            <input
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              type="date"
              placeholder="Data de Fabricação"
              id="data_de_fabricacao"
              {...register("data_de_fabricacao")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Perecível
            </label>
            <select
              className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
              placeholder="Perecível"
              id="produto_perecivel"
              defaultValue=""
              {...register("produto_perecivel")}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setIsPerecivel(e.target.value)
              }
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
          {isPerecivel === "true" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                Data de Validade
              </label>
              <input
                className="w-full p-4 text-sm text-gray-600 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                type="date"
                placeholder="Data de Validade"
                id="data_de_validade"
                {...register("data_de_validade")}
              />
            </div>
          )}
          <Button title="Enviar" />
        </form>
      </div>
    </div>
  );
};

export default New;
