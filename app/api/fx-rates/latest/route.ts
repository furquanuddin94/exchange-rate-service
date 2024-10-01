import { NextRequest, NextResponse } from 'next/server';
import { FxRateEntriesProvider, FxRateEntry } from '@/app/libs/FxRateEntriesProvider';
import NodeCache from 'node-cache';

export type LatestFxRateResponse = {
    data: FxRateEntry[];
    fetchedAt: number;
}

// Initialize NodeCache with 5-minute TTL
const cache = new NodeCache({ stdTTL: 300 });

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);

    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');

    if (!fromCurrency || !toCurrency) {
        console.error('From and to currencies are required');
        return NextResponse.json({ error: 'From and to currencies are required' }, { status: 400 });
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;

    // Check if the data is already cached
    const cachedData = cache.get<LatestFxRateResponse>(cacheKey);

    if (cachedData) {
        console.log(`Cache hit for ${cacheKey}`);
        return NextResponse.json(cachedData);
    } else {
        console.log(`Cache miss for ${cacheKey}`);
    }

    try {
        // Fetch the latest FX rate entries
        const fxRateEntries = await FxRateEntriesProvider.getFxRateEntries(fromCurrency, toCurrency);

        const response: LatestFxRateResponse = {
            data: fxRateEntries,
            fetchedAt: Date.now()
        };

        // Store the data in the cache
        cache.set(cacheKey, response);

        console.log(`Cache set for ${cacheKey}`);

        return NextResponse.json(response);
    } catch (error) {
        console.error(`Failed to fetch FX rates for ${fromCurrency} to ${toCurrency}`, error);
        return NextResponse.json({ error: 'Failed to fetch exchange rates' }, { status: 500 });
    }
}
