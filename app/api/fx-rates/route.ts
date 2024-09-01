import { fetchFromSource, fetchTimeSeriesDataPointsFromCache, sourceConfigs } from "@/app/utils/cacheUtils";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {

    const lookbackInHours = 24 * 30; // 30 days

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - lookbackInHours);
    const endTime = new Date();

    const allSourcesDataMap = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const datapoints = await fetchTimeSeriesDataPointsFromCache(config, startTime.getTime(), endTime.getTime());

            return {
                source: config.sourceName,
                data: datapoints
            }
        })
    )

    return NextResponse.json(allSourcesDataMap);
}

export async function POST() {

    const freshDataFromSources = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const datapoints = await fetchFromSource(config);

            return {
                source: config.sourceName,
                data: datapoints
            }
        })
    )

    console.log("All FX rates fetched");
    revalidateTag('fxRates');
    
    return NextResponse.json(freshDataFromSources);
}