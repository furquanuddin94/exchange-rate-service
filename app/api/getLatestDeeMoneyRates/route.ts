import { ExchangeRateInfo } from "@/app/common/model/ExchangeRateInfo";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    const inrExchangeRate = await kv.get('deemoney-exchange-rate');

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
            await kv.set('deemoney-exchange-rate', rate, { ex: 300 });
            return Response.json(rate);
        })
        .catch(error => {
            return Response.json({ error: error.message });
        });
    }
    
    
}