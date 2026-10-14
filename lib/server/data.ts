import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";

// Server-only cached loaders (Cache Components is on). They THROW on failure
// on purpose: a failed result is never cached, so a Render cold start can't
// freeze an empty homepage. Callers catch and render a fallback.

export async function getHomeData() {
  "use cache";
  cacheLife("minutes");

  const [categories, featured, arrivals, latest] = await Promise.all([
    getCategories(),
    getProducts({ is_featured: true, limit: 8 }),
    getProducts({ is_new_arrival: true, limit: 8 }),
    getProducts({ limit: 8 }),
  ]);

  return {
    categories,
    featured: featured.items,
    arrivals: arrivals.items,
    latest: latest.items,
  };
}

export async function getFooterCategories() {
  "use cache";
  cacheLife("hours");
  const categories = await getCategories();
  return categories.filter((c) => !c.parentId);
}