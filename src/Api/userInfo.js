import { api } from "./api";

const userInfo = api.injectEndpoints({
  endpoints: (builder) => ({
    getSingleUser: builder.query({
      query: (id) => `/user-info/${id}`,
    }),
  }),
});

export const { useGetSingleUserQuery } = userInfo;
