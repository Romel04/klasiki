import type { Pagination, Product, ProductQuery, ProductVariant } from "@/types/product";
import { apiEnvelope, apiJson } from "./http";

interface ApiVariant {
  id: string | number;
  name: string;
  attributes: Record<string, string> | null;
  price: string | number | null;
  discount_price: string | number | null;
  stock_qty: number;
  is_active: boolean;
}

interface ApiImage {
  image_url: string;
  sort_order?: number;
}

interface ApiProduct {
  id: string | number;
  category_id: string | number;
  category?: { id: string | number; name: string };
  name: string;
  description: string;
  price: string | number;
  discount_price: string | number | null;
  stock_qty: number;
  is_best_selling: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  images?: ApiImage[];
  // Confirmed live: nested variants come back camelCase.
  productVariants?: ApiVariant[];
}

const positive = (v: string | number | null | undefined) => {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return n > 0 ? n : undefined;
};

function fromApiVariant(v: ApiVariant): ProductVariant {
  return {
    id: String(v.id),
    color: v.attributes?.color ?? v.name,
    stock: v.stock_qty,
    price: positive(v.price),
    discountPrice: positive(v.discount_price),
  };
}

function fromApiProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    description: p.description,
    price: Number(p.price),
    discountPrice: positive(p.discount_price),
    categoryId: String(p.category_id),
    categoryName: p.category?.name,
    isFeatured: p.is_featured,
    isBestSelling: p.is_best_selling,
    isNewArrival: p.is_new_arrival,
    stockQty: p.stock_qty,
    images: (p.images ?? [])
      .map((i) => ({ url: i.image_url, sortOrder: i.sort_order ?? 0 }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    variants: (p.productVariants ?? []).map(fromApiVariant),
  };
}

function toQueryString(q: ProductQuery) {
  const params = new URLSearchParams();
  Object.entries({ is_active: true, ...q }).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  return params.toString();
}

export async function getProduct(id: string, opts: { timeoutMs?: number } = {}): Promise<Product> {
  const data = await apiJson<ApiProduct>(
    `/products/${id}`,
    {
      next: { revalidate: 60 },
      ...(opts.timeoutMs ? { signal: AbortSignal.timeout(opts.timeoutMs) } : {}),
    },
    "Failed to fetch product",
  );
  return fromApiProduct(data);
}

// GET /products returns NO images or variants, but product cards show an image
// carousel. So each listed product is enriched from GET /products/{id} (cached
// 60s, requests run in parallel). A slow/failed detail call never fails the
// list: that card simply falls back to its placeholder image.
// Better long-term: ask the backend to include `images` in the list response,
// then pass { images: false } here and delete the enrichment.
const ENRICH_TIMEOUT_MS = 8000;

export async function getProducts(
  q: ProductQuery = {},
  opts: { images?: boolean } = {},
): Promise<{ items: Product[]; pagination: Pagination }> {
  const env = await apiEnvelope<ApiProduct[]>(
    `/products?${toQueryString(q)}`,
    { next: { revalidate: 60 } },
    "Failed to fetch products",
  );
  let items = env.data.map(fromApiProduct);

  if (opts.images !== false) {
    items = await Promise.all(
      items.map(async (p) => {
        try {
          const full = await getProduct(p.id, { timeoutMs: ENRICH_TIMEOUT_MS });
          return { ...p, images: full.images, variants: full.variants };
        } catch {
          return p;
        }
      }),
    );
  }

  return {
    items,
    pagination: env.pagination ?? { total: env.data.length, page: 1, limit: env.data.length, totalPages: 1 },
  };
}
