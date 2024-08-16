import { fetchFromCacheOrSource, sourceConfigs } from "@/app/utils/cacheUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sources = ["deeMoney", "westernUnion", "latest"];
    const allFx = await Promise.all(sources.map(source => fetchFromCacheOrSource(sourceConfigs[source])));

    const fxMap: { [key: string]: any } = {};
    sources.forEach((source, index) => {
      fxMap[source] = allFx[index];
    });

    console.log("All FX rates fetched");
    return NextResponse.json(fxMap);
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    return NextResponse.error();
  }
}