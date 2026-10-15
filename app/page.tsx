import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { ProductRail } from "@/components/home/product-rail";
import { BrandStatement } from "@/components/home/brand-statement";
import { TrustStrip } from "@/components/home/trust-strip";
import { getHomeData } from "@/lib/server/data";

export default async function HomePage() {
  const data = await getHomeData().catch(() => null);

  const topLevel = data?.categories.filter((c) => !c.parentId) ?? [];
  // Until the admin flags products as featured, fall back to the latest ones.
  const trending =
    data && data.featured.length > 0 ? data.featured : (data?.latest ?? []);

  return (
    <>
      <Hero />
      {!data && (
        <p className="px-6 py-16 text-center text-sm text-muted-foreground">
          We couldn&apos;t load the collection just now. Please refresh in a
          moment.
        </p>
      )}
      <CategoryTiles categories={topLevel} />
      <ProductRail title="Trending" href="/shop?f=featured" products={trending} />
      <ProductRail title="Best sellers" href="/shop?f=best" products={data?.bestSelling ?? []} />
      <ProductRail title="New arrivals" href="/shop?f=new" products={data?.arrivals ?? []} />
      <BrandStatement />
      <TrustStrip />
    </>
  );
}
