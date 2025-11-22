import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const standupsApi = createApi({
  reducerPath: "standupsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
  }),

  tagTypes: ["Standups", "Team", "Vacations"],

  endpoints: (builder) => ({

    getTeamMembers: builder.query({
      query: () => "/teamMembers",
      providesTags: ["Team"],
    }),

    getStandups: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/standups?${query}`;
      },
      providesTags: ["Standups"],
    }),

    submitStandup: builder.mutation({
      query: (payload) => ({
        url: "/standups",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Standups"],
    }),

    getVacations: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/vacations?${query}`;
      },
      providesTags: ["Vacations"],
    }),

    submitVacation: builder.mutation({
      query: (payload) => ({
        url: "/vacations",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Vacations"],
    }),

    getStatistics: builder.query({
      query: () => "/statistics",
    }),
    
  }),
})

export const {
  useGetTeamMembersQuery,
  useGetStandupsQuery,
  useSubmitStandupMutation,
  useGetVacationsQuery,
  useSubmitVacationMutation,
  useGetStatisticsQuery
} = standupsApi;
