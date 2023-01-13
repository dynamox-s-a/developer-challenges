import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { criarProduto, deletarProduto, editarProduto, listarProdutos, Ordenacao, Produto } from "./productsAPI";

export interface ProductsState {
    data?: Produto[],
    count?: number,
    selectedProduct?: Produto
}

const initialState: ProductsState = {}

export const listar = createAsyncThunk(
    "products/listar",
    ({ pagina, ordenacao }: { pagina: number, ordenacao: Ordenacao }) => listarProdutos(pagina, ordenacao)
)

export const criar = createAsyncThunk(
    "products/criar",
    (produto: Produto) => criarProduto(produto)
)
export const remover = createAsyncThunk(
    "products/remover",
    (id: number) => deletarProduto(id)
)
export const editar = createAsyncThunk(
    "products/editar",
    (produto: Produto) => editarProduto(produto)
)


export const productsSlice = createSlice({
    name: "produtos",
    initialState,
    reducers: {
        selecionarProduto: (state, action: PayloadAction<Produto>) => {
            state.selectedProduct = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listar.fulfilled, (state, action) => {
                state.data = action.payload.produtos
                state.count = action.payload.total
            })
    }

})

export const { selecionarProduto } = productsSlice.actions

export const selectProducts = (state: RootState) => state.products.data;
export const selectProductsCount = (state: RootState) => state.products.count;
export const selectEditProduct = (state: RootState) => state.products.selectedProduct

export default productsSlice.reducer