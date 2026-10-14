import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductListing, type SearchParams } from "@/components/shop/product-listing";
import { ListingSkeleton } from "@/components/shop/listing-skeleton";

export const metadata: Metadata = { title: "Shop" };

// Cache Components: anything reading searchParams must sit under <Suspense>.
export default function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <ProductListing title="Shop all" basePath="/shop" searchParams={searchParams} />
    </Suspense>
  );
}
