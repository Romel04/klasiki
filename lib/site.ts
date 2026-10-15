// Absolute site URL for metadata, canonical links and the sitemap.
// Set NEXT_PUBLIC_SITE_URL once the custom domain exists.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
