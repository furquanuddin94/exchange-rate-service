export const constants = {
    env: process.env.NEXT_PUBLIC_VERCEL_ENV,
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    pullRequestId: process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID,
    protectionBypass: process.env.VERCEL_PROTECTION_BYPASS
}
