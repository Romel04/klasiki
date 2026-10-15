import Link from "next/link";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";
import { productPath } from "@/lib/slug";
import { CardCarousel } from "./card-carousel";

const MAX_CARD_IMAGES = 5;

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const soldOut = product.stockQty === 0;
  const onSale = product.discountPrice != null;
  const href = productPath(product);

  const images =
    product.images.length > 0
      ? product.images.slice(0, MAX_CARD_IMAGES).map((i) => i.url)
      : [getProductImage(product)];

  return (
    <div className="group">
      <CardCarousel images={images} alt={product.name} href={href} priority={priority}>
        {soldOut && <Tag>Sold out</Tag>}
        {!soldOut && product.isNewArrival && <Tag>New</Tag>}
        {!soldOut && onSale && <Tag sale>Sale</Tag>}
      </CardCarousel>

      <Link href={href} className="mt-3 block space-y-1">
        <h3 className="text-sm leading-snug">{product.name}</h3>
        <p className="text-sm">
          {onSale ? (
            <>
              <span className="font-medium text-sale">{formatPrice(product.discountPrice!)}</span>{" "}
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-medium">{formatPrice(product.price)}</span>
          )}
        </p>
      </Link>
    </div>
  );
}

function Tag({ children, sale }: { children: React.ReactNode; sale?: boolean }) {
  return (
    <span
      className={`px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
        sale ? "bg-sale text-white" : "bg-background text-foreground"
      }`}
    >
      {children}
    </span>
  );
}
