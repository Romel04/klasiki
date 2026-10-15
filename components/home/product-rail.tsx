import Link from "next/link";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/product/product-grid";

export function ProductRail({
  title,
  href,
  products,
  priorityCount = 0,
}: {
  title: string;
  href: string;
  products: Product[];
  priorityCount?: number;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-6 md:pb-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-serif text-2xl font-medium md:text-3xl">{title}</h2>
        <Link href={href} className="text-[11px] uppercase tracking-[0.18em] underline underline-offset-4">
          View all
        </Link>
      </div>
      <ProductGrid products={products.slice(0, 8)} priorityCount={priorityCount} />
    </section>
  );
}
