import { cacheConfigMap, cacheFetch } from "@/app/utils/cacheUtils";

export const fetchCache = 'force-no-store'

const deeMoneyFetch = async () => {
    const response = await fetch('https://www.deemoney.com/api/v2/exchange-rates');
    const data = await response.json();
    return 1 / (data.exchangeRates[0].rates.INR);
};

export async function GET() {
    return cacheFetch(cacheConfigMap.deeMoney, deeMoneyFetch);
}