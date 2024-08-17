import { fetchFromCacheOrSource, fetchTimeSeriesDataPointsFromCache, sourceConfigs } from "@/app/utils/cacheUtils";
import { TimeSeriesData } from "@/app/utils/fxTimeSeriesDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lookbackParam = searchParams.get("lookbackInHours");

  const lookbackInHours = lookbackParam ? parseInt(lookbackParam) : 24;

  const graphStartTime = new Date();
  graphStartTime.setHours(graphStartTime.getHours() - lookbackInHours);
  const graphEndTime = new Date();

  let granularityInMinutes;

  if (lookbackInHours === 1) {
    granularityInMinutes = 5;
  } else if (lookbackInHours <= 6) {
    granularityInMinutes = 15;
  } else if (lookbackInHours <= 24) {
    granularityInMinutes = 5; //for testing
  } else if (lookbackInHours <= 48) {
    granularityInMinutes = 4 * 60;
  } else {
    granularityInMinutes = 24 * 60;
  }

  const [deeMoneyDatapoints, westernUnionDatapoints, latestDatapoints] = await Promise.all([
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.deeMoney, graphStartTime.getTime(), graphEndTime.getTime(), granularityInMinutes),
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.westernUnion, graphStartTime.getTime(), graphEndTime.getTime(), granularityInMinutes),
    fetchTimeSeriesDataPointsFromCache(sourceConfigs.latest, graphStartTime.getTime(), graphEndTime.getTime(), granularityInMinutes),
  ]);

  const getTimeLabel = (timestamp: number) => {
    const date = new Date(timestamp);

    let timeLabel = "";

    if (granularityInMinutes < (4 * 60)) {
      timeLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
    } else {
      timeLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
    return timeLabel;
  };

  const getFxMap = (datapoints: TimeSeriesData[]) => {
    const fxMap: { [key: string]: any } = {};
    datapoints.forEach(dataPoint => {
      const minutesSinceEpoch = dataPoint.timestamp / 1000 / 60;
      const minuteOffsetFromGranularity = minutesSinceEpoch % granularityInMinutes;
      const roundedOffMinutesSinceEpoch = minuteOffsetFromGranularity > granularityInMinutes / 2
        ? minutesSinceEpoch + granularityInMinutes - minuteOffsetFromGranularity
        : minutesSinceEpoch - minuteOffsetFromGranularity;
      const timeLabel = getTimeLabel(roundedOffMinutesSinceEpoch * 60 * 1000);
      fxMap[timeLabel] = dataPoint.fxRate.toFixed(4);
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
    data: data
  }

  return NextResponse.json(response);
}