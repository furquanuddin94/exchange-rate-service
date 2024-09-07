import { cacheKeys } from "@/app/utils/cacheUtils";

export const constants = {
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    url: process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : 'http://localhost:3000',
    pullRequestId: process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID,
    protectionBypass: process.env.VERCEL_PROTECTION_BYPASS
}

export const supportedCurrencies: Record<string, { countryIsoCode: string, currencyIsoCode: string }> = {
    'USD': {
        'countryIsoCode': 'US',
        'currencyIsoCode': 'USD',
    },
    'THB': {
        'countryIsoCode': 'TH',
        'currencyIsoCode': 'THB',
    },
    'INR': {
        'countryIsoCode': 'IN',
        'currencyIsoCode': 'INR',
    },
    'IDR': {
        'countryIsoCode': 'ID',
        'currencyIsoCode': 'IDR',
    },
    'PHP': {
        'countryIsoCode': 'PH',
        'currencyIsoCode': 'PHP',
    },
    'EUR': {
        'countryIsoCode': 'DE',
        'currencyIsoCode': 'EUR',
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
