import { fetchFromCacheOrSource, sourceConfigs } from "@/app/utils/cacheUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  if (!source || !sourceConfigs[source]) {
    return Response.json({ error: 'Invalid source parameter' }, { status: 400 });
  }

  const data = await fetchFromCacheOrSource(sourceConfigs[source]);
  return NextResponse.json(data);
}