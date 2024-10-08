import { currencyPairToFxRateEntriesConfig, defaultFxRateEntryProviderConfig, supportedFxRateSourceProviders } from './config';
import { FxRateEntriesProvider, FxRateEntry } from './FxRateEntriesProvider';
import { FxTimeSeriesDB } from './FxTimeSeriesDb';

// Extend FxRateEntry to include timestamp
export interface CachedFxRateEntry extends FxRateEntry {
    timestamp: number;
}

export const FxRateCache = {
    /**
     * Fetches FX rates from the source and adds them to the cache.
     * 
     * @param fromCurrency The currency to convert from
     * @param toCurrency The currency to convert to
     * @returns Promise<CachedFxRateEntry[]> The fetched and cached FX rate entries
     */
    fetchFromSourceAndAddToCache: async (fromCurrency: string, toCurrency: string): Promise<CachedFxRateEntry[]> => {
        const fxRateEntries = await FxRateEntriesProvider.getFxRateEntries(fromCurrency, toCurrency);
        const config = currencyPairToFxRateEntriesConfig[fromCurrency]?.[toCurrency] || defaultFxRateEntryProviderConfig;
        const timestamp = Date.now();

        const cachedEntries: CachedFxRateEntry[] = [];

        for (const entry of fxRateEntries) {
            const configEntry = config.find(c => c.source === entry.source);
            if (configEntry && configEntry.cacheKey) {
                await FxTimeSeriesDB.saveFx(configEntry.cacheKey, entry.fxRate, timestamp);
            }
            cachedEntries.push({
                ...entry,
                timestamp
            });
        }

        return cachedEntries;
    },

    /**
     * Fetches FX rates from the cache.
     * 
     * @param fromCurrency The currency to convert from
     * @param toCurrency The currency to convert to
     * @returns Promise<CachedFxRateEntry[]> The cached FX rate entries
     */
    fetchFromCache: async (fromCurrency: string, toCurrency: string, startTime: number, endTime: number): Promise<CachedFxRateEntry[]> => {
        const config = currencyPairToFxRateEntriesConfig[fromCurrency]?.[toCurrency] || defaultFxRateEntryProviderConfig;
        const cachedEntries: CachedFxRateEntry[] = [];

        for (const configEntry of config) {
            const sourceConfig = supportedFxRateSourceProviders[configEntry.source];
            if (configEntry.cacheKey) {
                const timeSeriesData = await FxTimeSeriesDB.getData(configEntry.cacheKey, startTime, endTime);
                for (const data of timeSeriesData) {
                    cachedEntries.push({
                        source: configEntry.source,
                        displayName: sourceConfig.displayName,
                        uniqueDisplayName: configEntry.range 
                            ? `${sourceConfig.displayName}: ${configEntry.range}`
                            : sourceConfig.displayName,
                        fxRate: data.fxRate,
                        range: configEntry.range,
                        fees: configEntry.fees,
                        timestamp: data.timestamp
                    });
                }
            }
        }

        return cachedEntries;
    }
};

