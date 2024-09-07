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
    }
}

export type FxRateProviderConfig = {
    displayName: string;
    supportedFromCurrencies?: string[];
};

export const supportedFxRateProviders: { [key: string]: FxRateProviderConfig } = {
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
