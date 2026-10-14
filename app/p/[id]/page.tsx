import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { getProduct } from "@/lib/api/products";

async function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 md:grid-cols-2 md:px-6">
          <div className="aspect-[4/5] animate-pulse bg-muted" />
          <div className="space-y-4">
            <div className="h-6 w-2/3 animate-pulse bg-muted" />
            <div className="h-5 w-1/4 animate-pulse bg-muted" />
          </div>
        </div>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}
