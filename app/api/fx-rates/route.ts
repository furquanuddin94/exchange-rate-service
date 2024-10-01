import { fetchFromSourceAndCache, fetchTimeSeriesDataPointsFromCache, sourceConfigs } from "@/app/utils/cacheUtils";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import NodeCache from 'node-cache';

export const dynamic = 'force-dynamic';

// Create a new cache instance with a 15-minute TTL
const cache = new NodeCache({ stdTTL: 15 * 60 });

export async function GET() {
    const lookbackInHours = 24 * 30; // 30 days

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - lookbackInHours);
    const endTime = new Date();

    const cacheKey = `sources-data`;
    let allSourcesDataMap = cache.get(cacheKey);

    if (allSourcesDataMap) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return NextResponse.json(allSourcesDataMap);
    }

    console.log(`Cache miss for key: ${cacheKey}, fetching data from sources`);

    allSourcesDataMap = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const datapoints = await fetchTimeSeriesDataPointsFromCache(config, startTime.getTime(), endTime.getTime());

            return {
                source: config.sourceName,
                data: datapoints
            };
        })
    );

    // Store the result in cache with the specified TTL
    cache.set(cacheKey, allSourcesDataMap);
    console.log(`Data cached with key: ${cacheKey}`);

    return NextResponse.json(allSourcesDataMap);
}

export async function POST() {

    const currentTime = Date.now();
    const freshDataFromSources = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const datapoints = await fetchFromSourceAndCache(config, currentTime);

            return {
                source: config.sourceName,
                data: datapoints
            }
        })
    )

    console.log("All FX rates fetched");
    revalidateTag('fx-rates');

    return NextResponse.json(freshDataFromSources);
}