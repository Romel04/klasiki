import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing, type SearchParams } from "@/components/shop/product-listing";
import { ListingSkeleton } from "@/components/shop/listing-skeleton";
import { DynamicMarker } from "@/components/dynamic-marker";
import { getAllCategories } from "@/lib/server/data";
import { categoryPath, idFromParam } from "@/lib/slug";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const id = idFromParam((await params).id);
  const categories = await getAllCategories().catch(() => null);
  const category = id ? categories?.find((c) => c.id === id) : undefined;
  if (!category) return { title: "Shop" };

  return {
    title: category.name,
    description: `Shop ${category.name} from Klasiki. Handcrafted, made with care.`,
    alternates: { canonical: categoryPath(category) },
  };
}

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  const id = idFromParam((await params).id);
  if (!id) notFound();

  const categories = await getAllCategories().catch(() => null);

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
      basePath={categoryPath(category)}
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
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <>
      <Suspense fallback={<ListingSkeleton />}>
        <CategoryContent params={params} searchParams={searchParams} />
      </Suspense>
      <DynamicMarker />
    </>
  );
}
