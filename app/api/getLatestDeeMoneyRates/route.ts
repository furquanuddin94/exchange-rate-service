import { ExchangeRateInfo } from "@/app/common/model/ExchangeRateInfo";
import { cacheKeys, cacheExpiry }from "@/app/utils/cacheUtils";
import { kv } from "@vercel/kv";

export const fetchCache = 'force-no-store'

export async function GET() {
    const inrExchangeRate = await kv.get(cacheKeys.getDeeMoneyFxKey);

    if (inrExchangeRate) {
        console.log("Serving deemoney fx from cache.");
        return Response.json(inrExchangeRate);
    }  else {
        console.log("Fetching deemoney fx from API.");
        return fetch('https://www.deemoney.com/api/v2/exchange-rates')
        .then(response => response.json())
        .then(async data => {
            const value = 1 / (data.exchangeRates[0].rates.INR);
            const rate = new ExchangeRateInfo(value, new Date(Date.now()));
            await kv.set(cacheKeys.getDeeMoneyFxKey, rate, { ex: cacheExpiry.getDeeMoneyFxExpiry });
            return Response.json(rate);
        })
        .catch(error => {
            return Response.json({ error: error.message });
        });
    }
    
    
}