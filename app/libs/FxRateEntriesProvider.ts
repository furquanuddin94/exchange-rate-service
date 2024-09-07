import { currencyPairToFxRateEntriesConfig, defaultFxRateEntryProviderConfig, supportedFxRateSourceProviders } from "./config";
import { providersMap as providerMap } from "./FxRateSourceProvider";

type FxRateEntry = { source: string, displayName: string, uniqueDisplayName: string, fxRate: number, range?: string, fees?: string }

export const FxRateEntriesProvider = {
    getFxRateEntries: async (fromCurrency: string, toCurrency: string): Promise<FxRateEntry[]> => {
        const config = currencyPairToFxRateEntriesConfig[fromCurrency]?.[toCurrency] || defaultFxRateEntryProviderConfig;
        const fxRateEntries = (await Promise.all(config.map(async (entryProviderConfig) => {
            const sourceConfig = supportedFxRateSourceProviders[entryProviderConfig.source];
            const result = await providerMap[entryProviderConfig.source](fromCurrency, toCurrency, entryProviderConfig.amount || 10000);
            if (result) {
                return {
                    source: entryProviderConfig.source,
                    displayName: sourceConfig.displayName,
                    uniqueDisplayName: entryProviderConfig.range
                        ? `${sourceConfig.displayName}: ${entryProviderConfig.range}`
                        : sourceConfig.displayName,
                    fxRate: result.fxRate,
                    range: entryProviderConfig.range,
                    fees: entryProviderConfig.fees
                };
            }
            return null;
        }))).filter(entry => entry !== null);

        return fxRateEntries;
    }
}