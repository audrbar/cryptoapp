import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoApiHeaders = {
    'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_API_KEY,
}

const baseUrl = 'https://coinranking1.p.rapidapi.com';

const createRequest = (url) => ({ url, headers: cryptoApiHeaders })

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: (count) => createRequest(`/coins?limit=${count}`),
        }),
        getExchanges: builder.query({
            query: (exchanges) => createRequest(`/coins`),
        }),
        getCryptoDetails: builder.query({
            query: (coinUuid) => createRequest(`/coin/${coinUuid}`),
        }),
        getCryptoHistory: builder.query({
            query: ({ coinUuid, timePeriod }) => createRequest(`/coin/${coinUuid}/history?/timePeriod=${timePeriod}`),
        })
    })
});

export const { useGetCryptosQuery, useGetExchangesQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = cryptoApi;