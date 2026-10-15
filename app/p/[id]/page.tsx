import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { DynamicMarker } from "@/components/dynamic-marker";
import { getProductCached, getRelatedProducts } from "@/lib/server/data";
import { idFromParam, productPath } from "@/lib/slug";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const id = idFromParam((await params).id);
  if (!id) return { title: "Product not found" };

  const product = await getProductCached(id).catch(() => null);
  if (!product) return { title: "Product" };

  const description =
    product.description?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    "Handcrafted leather bags from Klasiki.";
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical: productPath(product) },
    openGraph: {
      title: product.name,
      description,
      url: productPath(product),
      images: image ? [{ url: image }] : undefined,
    },
  };
}

async function ProductContent({ params }: { params: Params }) {
  const id = idFromParam((await params).id);
  if (!id) notFound();

  let product;
  try {
    product = await getProductCached(id);
  } catch {
    // Backend asleep / unreachable: don't tell the customer the product is gone.
    return (
      <p className="px-6 py-24 text-center text-sm text-muted-foreground">
        We couldn&apos;t load this product just now. Please refresh in a moment.
      </p>
    );
  }
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id).catch(() => []);

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pb-24 md:px-6">
          <h2 className="mb-8 font-serif text-2xl font-medium md:text-3xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <>
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
      <DynamicMarker />
    </>
  );
}
