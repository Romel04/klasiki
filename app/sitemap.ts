import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { SITE_URL } from "@/lib/site";
import { categoryPath, productPath } from "@/lib/slug";
import { getAllCategories, getSitemapProducts } from "@/lib/server/data";

const STATIC_PATHS = ["/", "/shop", "/about", "/contact", "/shipping", "/exchange-return", "/terms", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always build at request time (cached loaders keep it cheap) so a backend
  // that was asleep during deploy can't freeze an empty product list.
  await connection();

  const [categories, products] = await Promise.all([
    getAllCategories().catch(() => []),
    getSitemapProducts().catch(() => []),
  ]);

  return [
    ...STATIC_PATHS.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}` })),
    ...categories.map((c) => ({ url: `${SITE_URL}${categoryPath(c)}` })),
    ...products.map((p) => ({ url: `${SITE_URL}${productPath(p)}` })),
  ];
}
