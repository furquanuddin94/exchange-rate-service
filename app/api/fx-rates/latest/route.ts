import { fetchFromCacheOrSource, sourceConfigs } from '@/app/utils/cacheUtils';
import { kebabToCamel } from '@/app/utils/commonUtils';
import { NextRequest, NextResponse } from 'next/server';

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