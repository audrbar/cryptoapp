import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retry } from '@reduxjs/toolkit/query/react';

// Using CryptoCompare API (Free, No API Key Required)
const baseUrl = 'https://min-api.cryptocompare.com/data/v2';

// Rate limiting for news API
let lastNewsRequestTime = 0;
const minNewsRequestInterval = 2000; // 2 seconds between requests

const rateLimitedNewsBaseQuery = async (args, api, extraOptions) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastNewsRequestTime;

    if (timeSinceLastRequest < minNewsRequestInterval) {
        await new Promise(resolve => setTimeout(resolve, minNewsRequestInterval - timeSinceLastRequest));
    }

    lastNewsRequestTime = Date.now();

    const result = await fetchBaseQuery({ baseUrl })(args, api, extraOptions);
    return result;
};

const newsBaseQueryWithRetry = retry(rateLimitedNewsBaseQuery, {
    maxRetries: 1,
});

// Transform CryptoCompare news data to match the expected format
const transformNewsData = (data, count) => {
    if (!data || !data.Data || !Array.isArray(data.Data)) {
        // Fallback mock data if API fails
        return {
            value: Array.from({ length: count }, (_, i) => ({
                name: `Crypto Market Update ${i + 1}`,
                url: 'https://www.coingecko.com/en/news',
                description: 'Latest cryptocurrency news and market analysis. Stay updated with the crypto market trends.',
                datePublished: new Date(Date.now() - i * 3600000).toISOString(),
                image: {
                    thumbnail: {
                        contentUrl: 'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg'
                    }
                },
                provider: [{
                    name: 'Crypto News',
                    image: {
                        thumbnail: {
                            contentUrl: 'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg'
                        }
                    }
                }]
            }))
        };
    }

    return {
        value: data.Data.slice(0, count).map(item => ({
            name: item.title || 'Crypto News',
            url: item.url || item.guid || '#',
            description: item.body || item.title || 'Cryptocurrency news update',
            datePublished: item.published_on ? new Date(item.published_on * 1000).toISOString() : new Date().toISOString(),
            image: {
                thumbnail: {
                    contentUrl: item.imageurl || 'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg'
                }
            },
            provider: [{
                name: item.source_info?.name || item.source || 'CryptoCompare',
                image: {
                    thumbnail: {
                        contentUrl: item.source_info?.img || 'http://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg'
                    }
                }
            }]
        }))
    };
};

export const cryptoNewsApi = createApi({
    reducerPath: 'cryptoNewsApi',
    baseQuery: newsBaseQueryWithRetry,
    keepUnusedDataFor: 600, // Cache news for 10 minutes
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: ({ newsCategory, count }) => {
                // CryptoCompare free API endpoint for news
                const categories = newsCategory && newsCategory !== 'Cryptocurrency'
                    ? `&categories=${newsCategory}`
                    : '';
                return `/news/?lang=EN${categories}`;
            },
            transformResponse: (response, meta, arg) => transformNewsData(response, arg.count),
            keepUnusedDataFor: 600, // 10 minutes cache
        })
    })
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;