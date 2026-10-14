import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stockQty === 0;
  const onSale = product.discountPrice != null;

  return (
    <Link href={`/p/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="img-zoom object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {soldOut && <Tag>Sold out</Tag>}
          {!soldOut && product.isNewArrival && <Tag>New</Tag>}
          {!soldOut && onSale && <Tag>Sale</Tag>}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm leading-snug">{product.name}</h3>
        <p className="text-sm">
          {onSale ? (
            <>
              <span className="font-medium">{formatPrice(product.discountPrice!)}</span>{" "}
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-medium">{formatPrice(product.price)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
      {children}
    </span>
  );
}
