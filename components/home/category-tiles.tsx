import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/category";
import { getCategoryImage } from "@/lib/product-utils";
import { categoryPath } from "@/lib/slug";

// Asymmetric editorial layout: one tall lead tile + two stacked tiles.
// Any further categories become quiet text links underneath.
export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const tiles = categories.slice(0, 3);
  const rest = categories.slice(3);
  const [lead, ...others] = tiles;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
      {tiles.length === 1 ? (
        <div className="grid">
          <Tile category={lead} className="aspect-[16/9] md:aspect-[21/9]" sizes="100vw" />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-[1.35fr_1fr] md:grid-rows-2 md:gap-4 md:h-[min(88vh,900px)]">
          <Tile category={lead} className="aspect-[4/5] md:row-span-2 md:aspect-auto" sizes="(min-width: 768px) 57vw, 100vw" />
          {others.map((c) => (
            <Tile key={c.id} category={c} className="aspect-[4/3] md:aspect-auto" sizes="(min-width: 768px) 43vw, 100vw" />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em]">
          <span className="text-muted-foreground">Also shop</span>
          {rest.map((c) => (
            <Link key={c.id} href={categoryPath(c)} className="underline underline-offset-4">
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Tile({ category, className, sizes }: { category: Category; className: string; sizes: string }) {
  return (
    <Link href={categoryPath(category)} className={`group relative block overflow-hidden bg-muted ${className}`}>
      <Image
        src={getCategoryImage(category.imageUrl, category.id)}
        alt={category.name}
        fill
        sizes={sizes}
        className="img-zoom object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h2 className="font-serif text-2xl font-medium md:text-3xl">{category.name}</h2>
        <span className="mt-2 inline-block text-[11px] uppercase tracking-[0.18em] underline underline-offset-4">
          Shop now
        </span>
      </div>
    </Link>
  );
}
