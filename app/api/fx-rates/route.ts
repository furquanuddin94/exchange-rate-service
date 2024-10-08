import { FxRateCache, CachedFxRateEntry } from "@/app/libs/FxRateCache";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import NodeCache from 'node-cache';

export const dynamic = 'force-dynamic';

// Create a new cache instance with a 15-minute TTL
const cache = new NodeCache({ stdTTL: 15 * 60 });

// Define the type for the transformed data
type TransformedFxData = {
    source: string;
    data: {
        timestamp: number;
        fxRate: number;
    }[];
}[];

export async function GET() {
    const fromCurrency = 'THB';
    const toCurrency = 'INR';
    const cacheKey = `${fromCurrency}-${toCurrency}-data`;
    let cachedData = cache.get<TransformedFxData>(cacheKey);

    if (cachedData) {
        console.log(`Local cache hit for key: ${cacheKey}`);
        return NextResponse.json(cachedData);
    }

    console.log(`Local cache miss for key: ${cacheKey}, fetching data from cache`);

    const endTime = Date.now();
    const startTime = endTime - 90 * 24 * 60 * 60 * 1000; // 90 days ago

    const cachedEntries = await FxRateCache.fetchFromCache(fromCurrency, toCurrency, startTime, endTime);

    // Transform the data to match the expected format
    const transformedData: TransformedFxData = cachedEntries.reduce((acc, entry: CachedFxRateEntry) => {
        const sourceIndex = acc.findIndex(item => item.source === entry.uniqueDisplayName);
        if (sourceIndex === -1) {
            acc.push({
                source: entry.uniqueDisplayName,
                data: [{
                    timestamp: entry.timestamp,
                    fxRate: entry.fxRate
                }]
            });
        } else {
            acc[sourceIndex].data.push({
                timestamp: entry.timestamp,
                fxRate: entry.fxRate
            });
        }
        return acc;
    }, [] as TransformedFxData);

    // Store the result in cache with the specified TTL
    cache.set(cacheKey, transformedData);
    console.log(`Data cached in local cache with key: ${cacheKey}`);

    return NextResponse.json(transformedData);
}

export async function POST() {
    const fromCurrency = 'THB';
    const toCurrency = 'INR';

    const freshDataFromSources = await FxRateCache.fetchFromSourceAndAddToCache(fromCurrency, toCurrency);

    // Transform the data to match the expected format
    const transformedData: TransformedFxData = freshDataFromSources.map(entry => ({
        source: entry.uniqueDisplayName,
        data: [{
            timestamp: entry.timestamp,
            fxRate: entry.fxRate
        }]
    }));

    console.log("All FX rates fetched and cached");
    revalidateTag('fx-rates');

    return NextResponse.json(transformedData);
}