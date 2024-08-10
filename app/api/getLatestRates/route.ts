import { ExchangeRateInfo } from "@/app/common/model/ExchangeRateInfo";
import cacheKeys from "@/app/utils/cacheKeys";
import { kv } from "@vercel/kv";

export const fetchCache = 'force-no-store'

export async function GET() {
  const latestExchangeRate = await kv.get(cacheKeys.getLatestExchangeRateKey());

  if (latestExchangeRate) {
    console.log("Serving latest fx from cache.");
    return Response.json(latestExchangeRate);
  } else {
    console.log("Fetching latest fx from API.");
    return fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/thb.json')
      .then(response => response.json())
      .then(async data => {
        const value = data.thb.inr;
        const rate = new ExchangeRateInfo(value, new Date(Date.now()));
        await kv.set(cacheKeys.getLatestExchangeRateKey(), rate, { ex: 300 });
        return Response.json(rate);
      })
      .catch(error => {
        return Response.json({ error: error.message });
      });
  }

}