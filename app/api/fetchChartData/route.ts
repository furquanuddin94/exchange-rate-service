import { fetchTimeSeriesDataPointsFromCache, sourceConfigs } from "@/app/utils/cacheUtils";
import { TimeSeriesData } from "@/app/utils/fxTimeSeriesDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lookbackParam = searchParams.get("lookbackInHours");

  const lookbackInHours = lookbackParam ? parseInt(lookbackParam) : 24;

  const graphStartTime = new Date();
  graphStartTime.setHours(graphStartTime.getHours() - lookbackInHours);
  const graphEndTime = new Date();

  const [deeMoneyDatapoints, westernUnionDatapoints, latestDatapoints] = await Promise.all([
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.deeMoney, graphStartTime.getTime(), graphEndTime.getTime()),
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.westernUnion, graphStartTime.getTime(), graphEndTime.getTime()),
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.latest, graphStartTime.getTime(), graphEndTime.getTime()),
  ]);

  const getFxMap = (datapoints: TimeSeriesData[]) => {
    const fxMap: { [key: string]: any } = {};
    datapoints.forEach(dataPoint => {
      const timestamp = dataPoint.timestamp;
      const minutesSinceEpoch = timestamp / 1000 / 60;
      const roundedMinutes = Math.round(minutesSinceEpoch);
      const label = roundedMinutes * 60 * 1000;
      fxMap[label] = dataPoint.fxRate.toFixed(4);
    })

    return fxMap;
  }

  const deeMoneyFxMap = getFxMap(deeMoneyDatapoints);
  const westernUnionFxMap = getFxMap(westernUnionDatapoints);
  const latestFxMap = getFxMap(latestDatapoints);

  const allKeys = Object.keys({ ...deeMoneyFxMap, ...westernUnionFxMap, ...latestFxMap });

  const data = allKeys.map(key => {
    return {
      label: key,
      readableTime: new Date(parseInt(key)).toLocaleString(),
      deeMoney: deeMoneyFxMap[key],
      westernUnion: westernUnionFxMap[key],
      latest: latestFxMap[key]
    }
  })

  const response = {
    labels: [{
      key: 'deeMoney',
      value: 'DeeMoney'
    },
    {
      key: 'westernUnion',
      value: 'Western Union'
    },
    {
      key: 'latest',
      value: 'Latest'
    }],
    data,
    lookbackInHours
  }

  return NextResponse.json(response);
}