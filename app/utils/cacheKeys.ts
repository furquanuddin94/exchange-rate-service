const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
const pullRequestId = process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID;

let cachePrefixArray = [];
if(env) {
    cachePrefixArray.push(env);
}
if(pullRequestId) {
    cachePrefixArray.push(pullRequestId);
}
const cachePrefixString = cachePrefixArray.length > 0 ? `${cachePrefixArray.join('-')}-` : 'local-';

const cacheKeys = {
    getDeeMoneyExchangeRateKey: () => `${cachePrefixString}deemoney-exchange-rate`,
    getWesternUnionExchangeRateKey: () => `${cachePrefixString}western-union-exchange-rate`,
    getLatestExchangeRateKey: () => `${cachePrefixString}latest-exchange-rate`,
};

export default cacheKeys;