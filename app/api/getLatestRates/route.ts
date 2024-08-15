import { cacheConfigMap, cacheFetch } from "@/app/utils/cacheUtils";

export const fetchCache = 'force-no-store'

const latestFetch = async () => {

  const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/thb.json');
  const data = await response.json();
  return data.thb.inr;
};

export async function GET() {
  return cacheFetch(cacheConfigMap.latest, latestFetch);
}