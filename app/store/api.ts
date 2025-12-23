import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Asset {
  id: "string";
  imageUrl: "string";
  videoUrl: "string";
  name: "string";
  description: "string";
  layout: "FULL_WIDTH" | "HALF_WIDTH";
  tags: ["string"];
  autoplay: boolean;
  type: "CAT" | "HUMAN";
}

const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api-viz3tqcnyh.vercel.app/api",
  }),
  endpoints: (builder) => ({
    getHomepageData: builder.query<Asset[], undefined>({
      query: () => "/home",
    }),
    getItemData: builder.query<Asset, string>({
      query: (id) => `/item/${id}`,
    }),
  }),
});

export { baseApi };
export const {
  useGetHomepageDataQuery,
  reducer,
  reducerPath,
  middleware,
  useGetItemDataQuery,
} = baseApi;
