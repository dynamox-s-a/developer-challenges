import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'http://localhost:4000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // By using getState(), we ensure we're using the token from the Redux store
      // avoiding direct localStorage access and ensuring reactivity.
      const token = (getState() as { auth: { token: string } }).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Machines', 'MonitoringPoints', 'Sensors'],
  endpoints: () => ({})
});