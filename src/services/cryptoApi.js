import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retry } from '@reduxjs/toolkit/query/react';

// Using CoinGecko API v3 - Free, No API Key Required
const baseUrl = 'https://api.coingecko.com/api/v3';

// Rate limiting: Add delay between requests
let lastRequestTime = 0;
const minRequestInterval = 1000; // 1 second between requests

const rateLimitedBaseQuery = async (args, api, extraOptions) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < minRequestInterval) {
        await new Promise(resolve => setTimeout(resolve, minRequestInterval - timeSinceLastRequest));
    }

    lastRequestTime = Date.now();

    const result = await fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            // Add headers to avoid CORS issues
            headers.set('Accept', 'application/json');
            return headers;
        }
    })(args, api, extraOptions);

    return result;
};

// Wrap with retry logic
const baseQueryWithRetry = retry(rateLimitedBaseQuery, {
    maxRetries: 2,
});

// Transform CoinGecko data to match previous data structure
const transformCryptosData = (data, count) => {
    if (!data || !Array.isArray(data)) {
        return { data: { coins: [] } };
    }

    return {
        data: {
            coins: data.slice(0, count).map((coin, index) => ({
                uuid: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                iconUrl: coin.image,
                price: coin.current_price,
                marketCap: coin.market_cap,
                change: coin.price_change_percentage_24h,
                rank: coin.market_cap_rank || index + 1,
            }))
        }
    };
};

const transformCryptoDetails = (data) => {
    if (!data) return { data: { coin: null } };

    return {
        data: {
            coin: {
                uuid: data.id,
                symbol: data.symbol,
                name: data.name,
                slug: data.symbol,
                iconUrl: data.image?.large,
                price: data.market_data?.current_price?.usd,
                marketCap: data.market_data?.market_cap?.usd,
                rank: data.market_cap_rank,
                change: data.market_data?.price_change_percentage_24h,
                listedAt: new Date(data.genesis_date || Date.now()).getTime() / 1000,
                allTimeHigh: {
                    price: data.market_data?.ath?.usd || 0
                },
                numberOfMarkets: data.tickers?.length || 0,
                numberOfExchanges: data.tickers ? [...new Set(data.tickers.map(t => t.market?.name))].length : 0,
                supply: {
                    total: data.market_data?.total_supply || 0,
                    circulating: data.market_data?.circulating_supply || 0,
                    confirmed: !!data.market_data?.total_supply
                },
                description: data.description?.en || '',
                websiteUrl: data.links?.homepage?.[0] || '',
                links: data.links?.blockchain_site?.filter(link => link) || []
            }
        }
    };
};

const transformCryptoHistory = (data, timePeriod) => {
    if (!data || !data.prices) {
        return { data: { history: [], change: 0 } };
    }

    return {
        data: {
            change: ((data.prices[data.prices.length - 1][1] - data.prices[0][1]) / data.prices[0][1] * 100).toFixed(2),
            history: data.prices.map(([timestamp, price]) => ({
                price: price,
                timestamp: timestamp
            }))
        }
    };
};

// Map time periods to CoinGecko format
const getTimePeriodDays = (timePeriod) => {
    const periodMap = {
        '3h': 0.125,
        '24h': 1,
        '7d': 7,
        '30d': 30,
        '3m': 90,
        '1y': 365,
        '3y': 1095,
        '5y': 1825
    };
    return periodMap[timePeriod] || 7;
};

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: baseQueryWithRetry,
    keepUnusedDataFor: 600, // Cache data for 10 minutes
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: (count) => `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false&price_change_percentage=24h`,
            transformResponse: (response, meta, arg) => transformCryptosData(response, arg),
            keepUnusedDataFor: 600, // 10 minutes cache
        }),
        getExchanges: builder.query({
            query: () => `/exchanges?per_page=10`,
            keepUnusedDataFor: 600, // 10 minutes cache
            transformResponse: (response) => {
                if (!response || !Array.isArray(response)) {
                    return { data: { exchanges: [] } };
                }
                return {
                    data: {
                        exchanges: response.map(exchange => ({
                            id: exchange.id,
                            name: exchange.name,
                            rank: exchange.trust_score_rank,
                            image: exchange.image,
                            volume24h: exchange.trade_volume_24h_btc,
                            yearEstablished: exchange.year_established,
                            country: exchange.country,
                            description: exchange.description || `${exchange.name} is a cryptocurrency exchange.`,
                            url: exchange.url
                        }))
                    }
                };
            },
        }),
        getCryptoDetails: builder.query({
            query: (coinId) => `/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false`,
            transformResponse: (response) => transformCryptoDetails(response),
            keepUnusedDataFor: 600, // 10 minutes cache
        }),
        getCryptoHistory: builder.query({
            query: ({ coinUuid, timePeriod }) => {
                const days = getTimePeriodDays(timePeriod);
                return `/coins/${coinUuid}/market_chart?vs_currency=usd&days=${days}`;
            },
            transformResponse: (response, meta, arg) => transformCryptoHistory(response, arg.timePeriod),
            keepUnusedDataFor: 300, // 5 minutes cache
        })
    })
});

export const { useGetCryptosQuery, useGetExchangesQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = cryptoApi;