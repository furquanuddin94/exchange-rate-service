export const envConstants = {
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    url: process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : 'http://localhost:3000',
    pullRequestId: process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID,
    protectionBypass: process.env.VERCEL_PROTECTION_BYPASS
}

// Cache prefix calculation
const getCachePrefix = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV || 'production';
    const pullRequestId = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID;
    let cachePrefixArray = [];
    if (env) {
        cachePrefixArray.push(env);
    }
    if (pullRequestId) {
        cachePrefixArray.push(pullRequestId);
    }
    return cachePrefixArray.length > 0 ? `${cachePrefixArray.join('-')}-` : 'local-';
};

const cachePrefix = getCachePrefix();

// Cache keys: legacy, need to be migrated to new keys
const cacheKeys = {
    getDeeMoneyFxKey: `${cachePrefix}deemoney-fx`,
    getWesternUnionFxKey: `${cachePrefix}western-union-fx`,
    getWesternUnion2FxKey: `${cachePrefix}western-union-2-fx`,
    getWesternUnion3FxKey: `${cachePrefix}western-union-3-fx`,
    getLatestFxKey: `${cachePrefix}latest-fx`,
};

export const supportedCurrencies: Record<string, { countryIsoCode: string, currencyIsoCode: string }> = {
    'USD': {
        'countryIsoCode': 'US',
        'currencyIsoCode': 'USD',
    },
    'EUR': {
        'countryIsoCode': 'EU',
        'currencyIsoCode': 'EUR',
    },
    'GBP': {
        'countryIsoCode': 'GB',
        'currencyIsoCode': 'GBP',
    },
    'JPY': {
        'countryIsoCode': 'JP',
        'currencyIsoCode': 'JPY',
    },
    'AUD': {
        'countryIsoCode': 'AU',
        'currencyIsoCode': 'AUD',
    },
    'CAD': {
        'countryIsoCode': 'CA',
        'currencyIsoCode': 'CAD',
    },
    'CHF': {
        'countryIsoCode': 'CH',
        'currencyIsoCode': 'CHF',
    },
    'CNY': {
        'countryIsoCode': 'CN',
        'currencyIsoCode': 'CNY',
    },
    'NZD': {
        'countryIsoCode': 'NZ',
        'currencyIsoCode': 'NZD',
    },
    'INR': {
        'countryIsoCode': 'IN',
        'currencyIsoCode': 'INR',
    },
    'SGD': {
        'countryIsoCode': 'SG',
        'currencyIsoCode': 'SGD',
    },
    'HKD': {
        'countryIsoCode': 'HK',
        'currencyIsoCode': 'HKD',
    },
    'ZAR': {
        'countryIsoCode': 'ZA',
        'currencyIsoCode': 'ZAR',
    },
    'THB': {
        'countryIsoCode': 'TH',
        'currencyIsoCode': 'THB',
    },
    'PHP': {
        'countryIsoCode': 'PH',
        'currencyIsoCode': 'PHP',
    },
    'IDR': {
        'countryIsoCode': 'ID',
        'currencyIsoCode': 'IDR',
    },
    'BRL': {
        'countryIsoCode': 'BR',
        'currencyIsoCode': 'BRL',
    },
    'MXN': {
        'countryIsoCode': 'MX',
        'currencyIsoCode': 'MXN',
    }
}

export type FxRateSourceProviderConfig = {
    displayName: string;
    supportedFromCurrencies?: string[];
};

export const supportedFxRateSourceProviders: { [key: string]: FxRateSourceProviderConfig } = {
    'deeMoney': {
        displayName: 'DeeMoney',
        supportedFromCurrencies: ['THB']
    },
    'westernUnion': {
        displayName: 'Western Union'
    },
    'latest': {
        displayName: 'Latest'
    }
}

export type FxRateEntryProviderConfig = {
    source: string;
    range?: string;
    fees?: string;
    cacheKey?: string;
    amount?: number;
}

export const currencyPairToFxRateEntriesConfig: { [fromCurrency: string]: { [toCurrency: string]: FxRateEntryProviderConfig[] } } = {
    'THB': {
        'INR': [
            {
                source: 'deeMoney',
                range: '0 to 500k',
                fees: '133.75 THB',
                cacheKey: cacheKeys.getDeeMoneyFxKey,
            },
            {
                source: 'westernUnion',
                range: '0 to 50k',
                fees: '130.35 THB',
                cacheKey: cacheKeys.getWesternUnionFxKey,
                amount: 10000
            },
            {
                source: 'westernUnion',
                range: '50k to 100k',
                fees: '130.35 THB',
                cacheKey: cacheKeys.getWesternUnion2FxKey,
                amount: 60000
            },
            {
                source: 'westernUnion',
                range: '100k to 250k',
                fees: '130.35 THB',
                cacheKey: cacheKeys.getWesternUnion3FxKey,
                amount: 110000
            },
            {
                source: 'latest',
                cacheKey: cacheKeys.getLatestFxKey
            }
        ]
    }
}

export const defaultFxRateEntryProviderConfig: FxRateEntryProviderConfig[] = [
    {
        source: 'latest',
    },
    {
        source: 'deeMoney',
    },
    {
        source: 'westernUnion',
    }
]
