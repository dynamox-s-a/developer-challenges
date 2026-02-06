import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'http://localhost:4000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Machines', 'MonitoringPoints', 'Sensors'],
  endpoints: () => ({})
});