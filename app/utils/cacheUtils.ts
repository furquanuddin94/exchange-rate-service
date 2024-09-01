import { constants } from "./envUtils";
import { deeMoneyFetch, latestFetch, westernUnion110kFetch, westernUnion10kFetch, westernUnion60kFetch } from "./fetchUtils";
import FxTimeSeriesDB, { TimeSeriesData } from "./fxTimeSeriesDb";

let cachePrefixArray = [];
if (constants.env) {
    cachePrefixArray.push(constants.env);
};
if (constants.pullRequestId) {
    cachePrefixArray.push(constants.pullRequestId);
};
const cachePrefixString = cachePrefixArray.length > 0 ? `${cachePrefixArray.join('-')}-` : 'local-';

const cacheKeys = {
    getDeeMoneyFxKey: `${cachePrefixString}deemoney-fx`,
    getWesternUnionFxKey: `${cachePrefixString}western-union-fx`,
    getWesternUnion2FxKey: `${cachePrefixString}western-union-2-fx`,
    getWesternUnion3FxKey: `${cachePrefixString}western-union-3-fx`,
    getLatestFxKey: `${cachePrefixString}latest-fx`,
};

const cacheExpiryInSeconds = 900;

const cacheExpiry = {
    getDeeMoneyFxExpiry: cacheExpiryInSeconds,
    getWesternUnionFxExpiry: cacheExpiryInSeconds,
    getWesternUnion2FxExpiry: cacheExpiryInSeconds,
    getWesternUnion3FxExpiry: cacheExpiryInSeconds,
    getLatestFxExpiry: cacheExpiryInSeconds,
};

export const sourceConfigs: { [key: string]: CacheConfig } = {
    deeMoney: {
        sourceName: 'DeeMoney',
        fees: '133.75 THB',
        displayName: 'DeeMoney',
        description: 'Range: 0 to 500k',
        cacheKey: cacheKeys.getDeeMoneyFxKey,
        cacheExpiry: cacheExpiry.getDeeMoneyFxExpiry,
        fetchFresh: deeMoneyFetch
    },
    westernUnion: {
        sourceName: 'Western Union: 0 to 50k',
        fees: '130.35 THB',
        displayName: 'Western Union',
        description: 'Range: 0 to 50k',
        cacheKey: cacheKeys.getWesternUnionFxKey,
        cacheExpiry: cacheExpiry.getWesternUnionFxExpiry,
        fetchFresh: westernUnion10kFetch
    },
    westernUnion2: {
        sourceName: 'Western Union: 50k to 100k',
        fees: '130.35 THB',
        displayName: 'Western Union',
        description: 'Range: 50k to 100k',
        cacheKey: cacheKeys.getWesternUnion2FxKey,
        cacheExpiry: cacheExpiry.getWesternUnion2FxExpiry,
        fetchFresh: westernUnion60kFetch
    },
    westernUnion3: {
        sourceName: 'Western Union: 100k to 250k',
        fees: '130.35 THB',
        displayName: 'Western Union',
        description: 'Range: 100k to 250k',
        cacheKey: cacheKeys.getWesternUnion3FxKey,
        cacheExpiry: cacheExpiry.getWesternUnion3FxExpiry,
        fetchFresh: westernUnion110kFetch
    },
    latest: {
        sourceName: 'Latest',
        fees: null,
        displayName: 'Latest',
        description: null,
        cacheKey: cacheKeys.getLatestFxKey,
        cacheExpiry: cacheExpiry.getLatestFxExpiry,
        fetchFresh: latestFetch
    }
}

interface CacheConfig {
    sourceName: string;
    displayName: string;
    description: string | null;
    fees: string | null;
    cacheKey: string;
    cacheExpiry: number;
    fetchFresh: () => Promise<any>;
}

export async function fetchFromCacheOrSource(config: CacheConfig): Promise<TimeSeriesData> {
    const cachedData = await FxTimeSeriesDB.getLatestData(config.cacheKey, config.cacheExpiry);

    if (cachedData) {
        console.log(`Serving ${config.sourceName} from cache.`);
        return cachedData;
    } else {
        console.log(`Fetching ${config.sourceName} from API.`);
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