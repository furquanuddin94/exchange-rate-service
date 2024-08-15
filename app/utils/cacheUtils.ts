import FxTimeSeriesDB from "./fxTimeSeriesDb";

const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
const pullRequestId = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID;

let cachePrefixArray = [];
if (env) {
    cachePrefixArray.push(env);
};
if (pullRequestId) {
    cachePrefixArray.push(pullRequestId);
};
const cachePrefixString = cachePrefixArray.length > 0 ? `${cachePrefixArray.join('-')}-` : 'local-';

const cacheKeys = {
    getDeeMoneyFxKey: `${cachePrefixString}deemoney-fx`,
    getWesternUnionFxKey: `${cachePrefixString}western-union-fx`,
    getLatestFxKey: `${cachePrefixString}latest-fx`,
};

const cacheExpiryInSeconds = env === 'production' ? 300 : 10;

const cacheExpiry = {
    getDeeMoneyFxExpiry: cacheExpiryInSeconds,
    getWesternUnionFxExpiry: cacheExpiryInSeconds,
    getLatestFxExpiry: cacheExpiryInSeconds,
};

const cacheConfigMap = {
    deeMoney: {
        name: 'deemoney fx',
        cacheKey: cacheKeys.getDeeMoneyFxKey,
        cacheExpiry: cacheExpiry.getDeeMoneyFxExpiry
    },
    westernUnion: {
        name: 'western union fx',
        cacheKey: cacheKeys.getWesternUnionFxKey,
        cacheExpiry: cacheExpiry.getWesternUnionFxExpiry
    },
    latest: {
        name: 'latest fx',
        cacheKey: cacheKeys.getLatestFxKey,
        cacheExpiry: cacheExpiry.getLatestFxExpiry
    }
}

interface CacheConfig {
    name: string;
    cacheKey: string;
    cacheExpiry: number;
}

export async function cacheFetch(config: CacheConfig, fetchFn: () => Promise<any>) {
    const cachedData = await FxTimeSeriesDB.getLatestData(config.cacheKey, config.cacheExpiry);

    if (cachedData) {
        console.log(`Serving ${config.name} from cache.`);
        return Response.json(cachedData);
    } else {
        console.log(`Fetching ${config.name} from API.`);
        return fetchFn()
            .then(async data => {
                const freshCachedData = await FxTimeSeriesDB.saveFx(config.cacheKey, data);
                return Response.json(freshCachedData);
            })
            .catch(error => {
                return Response.json({ error: error.message });
            });
    }
}


export { cacheKeys, cacheExpiry, cacheConfigMap };