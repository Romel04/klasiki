import Link from "next/link";
import { categoryPath } from "@/lib/slug";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/product/product-grid";
import type { Category } from "@/types/category";
import type { Product, ProductQuery } from "@/types/product";

const PAGE_SIZE = 12;

export type SearchParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "new", label: "New arrivals" },
  { key: "best", label: "Best selling" },
  { key: "featured", label: "Trending" },
] as const;

function flagQuery(f: string): ProductQuery {
  if (f === "new") return { is_new_arrival: true };
  if (f === "best") return { is_best_selling: true };
  if (f === "featured") return { is_featured: true };
  return {};
}

function href(basePath: string, p: { f?: string; q?: string; page?: number }) {
  const params = new URLSearchParams();
  if (p.q) params.set("q", p.q);
  if (p.f && p.f !== "all") params.set("f", p.f);
  if (p.page && p.page > 1) params.set("page", String(p.page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

interface Props {
  title: string;
  basePath: string;
  searchParams: Promise<SearchParams>;
  // Category page: the category plus its subcategories, merged into one list.
  categoryIds?: string[];
  parent?: Category | null;
  subcategories?: Category[];
  searchMode?: boolean;
}

export async function ProductListing({
  title,
  basePath,
  searchParams,
  categoryIds,
  parent,
  subcategories = [],
  searchMode,
}: Props) {
  const sp = await searchParams;
  const q = searchMode ? first(sp.q)?.trim() : undefined;
  const f = first(sp.f) ?? (first(sp.new) === "1" ? "new" : "all");
  const page = Math.max(1, Number(first(sp.page)) || 1);

  if (searchMode && !q) {
    return (
      <Shell title="Search" count={null}>
        <p className="py-16 text-center text-sm text-muted-foreground">
          Type something in the search box to find a bag.
        </p>
      </Shell>
    );
  }

  let items: Product[] = [];
  let total = 0;
  let failed = false;

  try {
    const base: ProductQuery = { ...flagQuery(f), search: q };
    if (categoryIds && categoryIds.length > 1) {
      // The API filters by one category_id, so fetch the parent and each
      // subcategory, merge, and paginate here (fine while the catalog is small).
      const results = await Promise.all(
        categoryIds.map((id) =>
          getProducts({ ...base, category_id: id, limit: 100 }),
        ),
      );
      const map = new Map<string, Product>();
      results.forEach((r) => r.items.forEach((p) => map.set(p.id, p)));
      const all = [...map.values()];
      total = all.length;
      items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    } else {
      const r = await getProducts({
        ...base,
        category_id: categoryIds?.[0],
        page,
        limit: PAGE_SIZE,
      });
      items = r.items;
      total = r.pagination.total;
    }
  } catch {
    failed = true;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Shell
      title={searchMode ? `Results for “${q}”` : title}
      count={failed ? null : total}
    >
      {(parent || subcategories.length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {parent && <Chip href={categoryPath(parent)}>← {parent.name}</Chip>}
          {subcategories.map((c) => (
            <Chip key={c.id} href={categoryPath(c)}>
              {c.name}
            </Chip>
          ))}
        </div>
      )}

      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((x) => (
          <Chip
            key={x.key}
            href={href(basePath, { f: x.key, q })}
            active={f === x.key}
          >
            {x.label}
          </Chip>
        ))}
      </div>

      {failed ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          We couldn&apos;t load products just now. Please refresh in a moment.
        </p>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No products found.
        </p>
      ) : (
        <ProductGrid products={items} priorityCount={4} />
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.18em]">
          {page > 1 ? (
            <Link
              href={href(basePath, { f, q, page: page - 1 })}
              className="underline underline-offset-4"
            >
              Previous
            </Link>
          ) : (
            <span className="text-muted-foreground">Previous</span>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={href(basePath, { f, q, page: page + 1 })}
              className="underline underline-offset-4"
            >
              Next
            </Link>
          ) : (
            <span className="text-muted-foreground">Next</span>
          )}
        </nav>
      )}
    </Shell>
  );
}

function Shell({
  title,
  count,
  children,
}: {
  title: string;
  count: number | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8 flex items-baseline gap-3">
        <h1 className="text-[13px] font-medium uppercase tracking-[0.2em]">
          {title}
        </h1>
        {count !== null && (
          <span className="text-xs text-muted-foreground">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
