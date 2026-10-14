import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductListing, type SearchParams } from "@/components/shop/product-listing";
import { ListingSkeleton } from "@/components/shop/listing-skeleton";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <ProductListing title="Search" basePath="/search" searchParams={searchParams} searchMode />
    </Suspense>
  );
}
