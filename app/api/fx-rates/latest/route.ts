import { fetchFromSource, sourceConfigs } from '@/app/utils/cacheUtils';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {

    const latestDataFromAllSources = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const fxRate = await fetchFromSource(config);

            return {
                source: config.sourceName,
                displayName: config.displayName,
                description: config.description,
                fees: config.fees,
                data: {
                    fxRate,
                    timestamp: Date.now()
                }
            }
        })
    )

    // sort in descending order by fx rate
    latestDataFromAllSources.sort((a, b) => b.data.fxRate - a.data.fxRate);

    return NextResponse.json(latestDataFromAllSources);
}