import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Mudar para consumir do Env
const baseUrl= 'http://localhost:4000/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['Machines'],
  endpoints: () => ({})
})