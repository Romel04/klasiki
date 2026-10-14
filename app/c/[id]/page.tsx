import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductListing, type SearchParams } from "@/components/shop/product-listing";
import { ListingSkeleton } from "@/components/shop/listing-skeleton";
import { getCategories } from "@/lib/api/categories";

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const categories = await getCategories().catch(() => null);

  if (!categories) {
    return (
      <p className="px-6 py-20 text-center text-sm text-muted-foreground">
        We couldn&apos;t load this category just now. Please refresh in a moment.
      </p>
    );
  }

  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const subcategories = categories.filter((c) => c.parentId === id);
  const parent = category.parentId ? (categories.find((c) => c.id === category.parentId) ?? null) : null;

  return (
    <ProductListing
      title={category.name}
      basePath={`/c/${id}`}
      searchParams={searchParams}
      categoryIds={[id, ...subcategories.map((c) => c.id)]}
      parent={parent}
      subcategories={subcategories}
    />
  );
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
