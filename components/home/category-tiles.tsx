import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/category";
import { getCategoryImage } from "@/lib/product-utils";

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-6 md:py-24">
      <div
        className={`grid gap-3 md:gap-4 ${
          categories.length >= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {categories.slice(0, 6).map((c) => (
          <Link key={c.id} href={`/c/${c.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-muted">
            <Image
              src={getCategoryImage(c.imageUrl, c.id)}
              alt={c.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="img-zoom object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h2 className="text-sm font-medium uppercase tracking-[0.18em]">{c.name}</h2>
              <span className="mt-1 inline-block text-xs text-white/80 underline underline-offset-4">Shop now</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
