import { cacheFetch, sourceConfigs } from "@/app/utils/cacheUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allFx = await Promise.all([
      cacheFetch(sourceConfigs['deeMoney']),
      cacheFetch(sourceConfigs["westernUnion"]),
      cacheFetch(sourceConfigs["latest"])
    ]);

    console.log("All FX rates fetched:", allFx);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    return NextResponse.error();
  }
}