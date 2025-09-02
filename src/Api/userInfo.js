import { api } from "./api";

const userInfo = api.injectEndpoints({
  endpoints: (builder) => ({
    getSingleUser: builder.query({
      query: () => `/user-info/`,
    }),
  }),
});

export const { useGetSingleUserQuery } = userInfo;
