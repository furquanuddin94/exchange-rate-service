import { cacheFetch, sourceConfigs } from "@/app/utils/cacheUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  if (!source || !sourceConfigs[source]) {
    return Response.json({ error: 'Invalid source parameter' }, { status: 400 });
  }

  return cacheFetch(sourceConfigs[source]);
}