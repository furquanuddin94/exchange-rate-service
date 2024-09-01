import { fetchFromCacheOrSource, sourceConfigs } from '@/app/utils/cacheUtils';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {

    const latestDataFromAllSources = await Promise.all(
        Object.values(sourceConfigs).map(async config => {
            const datapoints = await fetchFromCacheOrSource(config);

            return {
                source: config.sourceName,
                data: datapoints
            }
        })
    )

    return NextResponse.json(latestDataFromAllSources);
}