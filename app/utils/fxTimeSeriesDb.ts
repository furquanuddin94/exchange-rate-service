import { kv } from '@vercel/kv';

export interface TimeSeriesData {
    timestamp: number;
    fxRate: number;
}

const FxTimeSeriesDB = {
    /**
     * Saves foreign exchange rate data to the database.
     *
     * @param {string} streamKey - The key identifying the stream of time series data.
     * @param {number} fxRate - The foreign exchange rate to be saved.
     * @return {Promise<TimeSeriesData>} A promise resolving when the data has been saved and returns the saved data.
     */
    async saveFx(streamKey: string, fxRate: number, timestamp: number | null): Promise<TimeSeriesData> {
        // Set the stream id to the timestamp if provided, otherwise use the wildcard
        const streamId = timestamp ? timestamp + '-*' : '*';

        // Save fxRate to the stream and get the entry id
        const id = await kv.xadd(streamKey, streamId, { fxRate: fxRate });

        // Retrieve the saved data using the entry id
        const data = await kv.xrange(streamKey, id, id);

        // Extract the first (and only) entry
        const [entryId, fields] = Object.entries(data)[0];

        const cacheTimestamp = parseInt(entryId.split('-')[0], 10);
        const savedData = {
            timestamp: cacheTimestamp,
            fxRate: fields.fxRate as number,
        };

        return savedData;
    },

    /**
     * Retrieves a range of time series data from the database.
     *
     * @param {string} streamKey - The key identifying the stream of time series data.
     * @param {number} startTime - The start time of the range (inclusive).
     * @param {number} endTime - The end time of the range (inclusive).
     * @return {Promise<TimeSeriesData[]>} A promise resolving to an array of time series data points.
     */
    async getData(streamKey: string, startTime: number, endTime: number): Promise<TimeSeriesData[]> {
        const results: Record<string, Record<string, unknown>> = await kv.xrevrange(
            streamKey,
            endTime.toString(),
            startTime.toString()
        );

        const reverseList = Object.entries(results).map(([id, fields]) => ({
            timestamp: parseInt(id.split('-')[0], 10),
            fxRate: fields.fxRate as number,
        }));

        return reverseList.reverse();
    },

    async getLatestData(streamKey: string, maxAgeInSeconds: number): Promise<TimeSeriesData | null> {
        const results: Record<string, Record<string, unknown>> = await kv.xrevrange(
            streamKey,
            '+',
            '-',
            1)

        const data = Object.entries(results).map(([id, fields]) => ({
            timestamp: parseInt(id.split('-')[0], 10),
            fxRate: fields.fxRate as number,
        }))[0]

        if (data && Date.now() - data.timestamp < maxAgeInSeconds * 1000) {
            return data
        }
        return null
    }
};

export default FxTimeSeriesDB;
