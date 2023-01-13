import axios from "axios"

export const url = "http://localhost:3000/produtos"

export const itemsPorPagina = 10
export type Produto = {
    id?: number,
    nome: string,
    fabricacao: string,
    perecivel: boolean,
    validade?: string,
    valor: number
}

export type Ordenacao = {
    sort: string,
    order: "asc" | "desc"

}

export type ListagemProduto = {
    produtos: Produto[],
    total: number
}

export async function criarProduto(produto: Produto): Promise<Produto> {
    const { data } = await axios.post<Produto>(url, produto, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    })
    return data
}

export async function editarProduto(produto: Produto): Promise<Produto> {
    const { data } = await axios.put<Produto>(`${url}/${produto.id}`, produto, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    })
    return data
}

export async function listarProdutos(pagina: number, ordenacao: Ordenacao = { order: "asc", sort: "nome" }): Promise<ListagemProduto> {
    const { data, headers } = await axios.get<Produto[]>(url, {
        params: {
            _limit: itemsPorPagina,
            _page: pagina,
            _sort: ordenacao.sort,
            _order: ordenacao.order
        },
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    })
    return {
        produtos: data,
        total: Number(headers["x-total-count"])
    }
}

export async function deletarProduto(id: number) {
    await axios.delete(`${url}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    })
}