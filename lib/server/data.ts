import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/api/categories";
import { getProduct, getProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/http";

// Server-only cached loaders (Cache Components is on). They THROW on failure
// on purpose: a failed result is never cached, so a Render cold start can't
// freeze an empty homepage. Callers catch and render a fallback.

export async function getHomeData() {
  "use cache";
  cacheLife("minutes");

  const [categories, featured, bestSelling, arrivals, latest] = await Promise.all([
    getCategories(),
    getProducts({ is_featured: true, limit: 8 }),
    getProducts({ is_best_selling: true, limit: 8 }),
    getProducts({ is_new_arrival: true, limit: 8 }),
    getProducts({ limit: 8 }),
  ]);

  return {
    categories,
    featured: featured.items,
    bestSelling: bestSelling.items,
    arrivals: arrivals.items,
    latest: latest.items,
  };
}

export async function getAllCategories() {
  "use cache";
  cacheLife("minutes");
  return getCategories();
}

export async function getFooterCategories() {
  "use cache";
  cacheLife("hours");
  const categories = await getCategories();
  return categories.filter((c) => !c.parentId);
}

// null = the product really doesn't exist (404). Any other failure throws.
export async function getProductCached(id: string) {
  "use cache";
  cacheLife("minutes");
  try {
    return await getProduct(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  "use cache";
  cacheLife("minutes");
  const r = await getProducts({ category_id: categoryId, limit: 5 });
  return r.items.filter((p) => p.id !== excludeId).slice(0, 4);
}

// Every active product id+name for the sitemap (no per-product enrichment).
export async function getSitemapProducts() {
  "use cache";
  cacheLife("hours");
  const out: { id: string; name: string }[] = [];
  for (let page = 1; page <= 10; page++) {
    const r = await getProducts({ page, limit: 100 }, { images: false });
    r.items.forEach((p) => out.push({ id: p.id, name: p.name }));
    if (page >= r.pagination.totalPages) break;
  }
  return out;
}
