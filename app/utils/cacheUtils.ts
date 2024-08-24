import { deeMoneyFetch, latestFetch, westernUnionFetch } from "./fetchUtils";
import FxTimeSeriesDB, { TimeSeriesData } from "./fxTimeSeriesDb";

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

const cacheExpiryInSeconds = 900;

const cacheExpiry = {
    getDeeMoneyFxExpiry: cacheExpiryInSeconds,
    getWesternUnionFxExpiry: cacheExpiryInSeconds,
    getLatestFxExpiry: cacheExpiryInSeconds,
};

export const sourceConfigs: { [key: string]: CacheConfig } = {
    deeMoney: {
        name: 'deemoney fx',
        cacheKey: cacheKeys.getDeeMoneyFxKey,
        cacheExpiry: cacheExpiry.getDeeMoneyFxExpiry,
        fetchFresh: deeMoneyFetch
    },
    westernUnion: {
        name: 'western union fx',
        cacheKey: cacheKeys.getWesternUnionFxKey,
        cacheExpiry: cacheExpiry.getWesternUnionFxExpiry,
        fetchFresh: westernUnionFetch
    },
    latest: {
        name: 'latest fx',
        cacheKey: cacheKeys.getLatestFxKey,
        cacheExpiry: cacheExpiry.getLatestFxExpiry,
        fetchFresh: latestFetch
    }
}

interface CacheConfig {
    name: string;
    cacheKey: string;
    cacheExpiry: number;
    fetchFresh: () => Promise<any>;
}

export async function fetchFromCacheOrSource(config: CacheConfig): Promise<TimeSeriesData> {
    const cachedData = await FxTimeSeriesDB.getLatestData(config.cacheKey, config.cacheExpiry);

    if (cachedData) {
        console.log(`Serving ${config.name} from cache.`);
        return cachedData;
    } else {
        console.log(`Fetching ${config.name} from API.`);
        return config.fetchFresh()
            .then(async data => {
                const freshCachedData = await FxTimeSeriesDB.saveFx(config.cacheKey, data, Date.now());
                return freshCachedData;
            });
    }
}

export async function fetchFromSource(config: CacheConfig): Promise<TimeSeriesData> {
    return config.fetchFresh().then(async data => {
        const freshCachedData = await FxTimeSeriesDB.saveFx(config.cacheKey, data, Date.now());
        return freshCachedData;
    })
}

export async function fetchTimeSeriesDataPointsFromCache(config: CacheConfig, startTime: number, endTime: number): Promise<TimeSeriesData[]> {
    const dataPoints = await FxTimeSeriesDB.getData(config.cacheKey, startTime, endTime);
    console.log(`Serving chart data from cache.`);

    return dataPoints;
}