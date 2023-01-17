import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { IDataProps, ResponseProductType, ResponseUserType } from "../../types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders(headers, { getState }) {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    loginUser: builder.mutation<ResponseUserType, IDataProps>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getAllProducts: builder.query<
      ResponseProductType[],
      { page: number; sort: string }
    >({
      query: ({ page, sort }) =>
        `products?_limit=10&_page=${page}&_sort=${sort}`,
    }),

    getSelectedProduct: builder.query<ResponseProductType, { id: string }>({
      query: ({ id }) => `products/${id}`,
    }),

    postProduct: builder.mutation<ResponseProductType, ResponseProductType>({
      query: (product) => ({
        url: "products",
        method: "POST",
        body: product,
      }),
    }),

    updateProduct: builder.mutation({
      query: (product) => ({
        url: `products/${product.id}`,
        method: "PATCH",
        body: product,
      }),
    }),

    deleteProduct: builder.mutation<ResponseProductType, { id: string }>({
      query: ({ id }) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetAllProductsQuery,
  useGetSelectedProductQuery,
  usePostProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = api;
