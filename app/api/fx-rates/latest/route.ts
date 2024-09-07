import { NextRequest, NextResponse } from 'next/server';
import { FxRateEntriesProvider, FxRateEntry } from '@/app/libs/FxRateEntriesProvider';

export type LatestFxRateResponse = {
    data: FxRateEntry[];
    fetchedAt: number;
}

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);

    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');

    if (!fromCurrency || !toCurrency) {
        return NextResponse.json({ error: 'From and to currencies are required' }, { status: 400 });
    }

    const fxRateEntries = await FxRateEntriesProvider.getFxRateEntries(fromCurrency, toCurrency);

    return NextResponse.json({
        data: fxRateEntries,
        fetchedAt: Date.now()
    });
}