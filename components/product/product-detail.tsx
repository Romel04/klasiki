"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/lib/cart/cart-store";
import { getProductImage } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";

export function ProductDetail({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);

  // A product with no variants can still be bought: use a synthetic "base-…"
  // variant id (checkout must send product_variant_id as undefined for these).
  const hasVariants = product.variants.length > 0;
  const variants: ProductVariant[] = hasVariants
    ? product.variants
    : [
        {
          id: `base-${product.id}`,
          color: "Standard",
          stock: product.stockQty,
        },
      ];

  const [variantId, setVariantId] = useState(
    () => (variants.find((v) => v.stock > 0) ?? variants[0]).id,
  );
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const original = selected.price ?? product.price;
  const unit =
    selected.discountPrice ??
    selected.price ??
    product.discountPrice ??
    product.price;
  const onSale = unit < original;
  const soldOut = selected.stock <= 0;

  const images =
    product.images.length > 0
      ? product.images.map((i) => i.url)
      : [getProductImage(product)];

  function handleAdd() {
    add({
      productId: product.id,
      variantId: selected.id,
      name: product.name,
      color: selected.color,
      unitPrice: unit,
      quantity: qty,
      image: images[0],
      maxStock: selected.stock,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 md:grid-cols-2 md:gap-14 md:px-6 md:py-14">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-3 md:flex-row">
        {images.length > 1 && (
          <div className="flex gap-2 md:flex-col">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setImgIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative h-20 w-16 shrink-0 bg-muted border ${
                  i === imgIndex ? "border-foreground" : "border-transparent"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/5] flex-1 bg-muted">
          <Image
            src={images[imgIndex]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Details */}
      <div className="max-w-md">
        {product.categoryName && (
          <Link
            href={`/c/${product.categoryId}`}
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:underline underline-offset-4"
          >
            {product.categoryName}
          </Link>
        )}
        <h1 className="mt-2 text-2xl font-light">{product.name}</h1>
        <p className="mt-3 text-lg">
          {onSale ? (
            <>
              <span className="font-medium">{formatPrice(unit)}</span>{" "}
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(original)}
              </span>
            </>
          ) : (
            <span className="font-medium">{formatPrice(unit)}</span>
          )}
        </p>

        {hasVariants && (
          <div className="mt-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em]">
              Color:{" "}
              <span className="text-muted-foreground">{selected.color}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariantId(v.id);
                    setQty(1);
                  }}
                  disabled={v.stock <= 0}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground disabled:line-through ${
                    v.id === variantId
                      ? "border-foreground bg-foreground text-white"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {v.color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center border border-border">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-11 w-11 hover:bg-muted"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(selected.stock, q + 1))}
              disabled={qty >= selected.stock}
              className="h-11 w-11 hover:bg-muted disabled:opacity-40"
            >
              +
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {soldOut
              ? "Out of stock"
              : selected.stock <= 5
                ? `Only ${selected.stock} left`
                : "In stock"}
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="mt-6 w-full bg-foreground py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-muted-foreground"
        >
          {soldOut ? "Sold out" : "Add to cart"}
        </button>

        <p className="mt-4 text-xs text-muted-foreground">
          Cash on delivery. Delivery charge is added at checkout by district.
        </p>

        {product.description && (
          <div className="mt-10 border-t border-border pt-6">
            <h2 className="mb-3 text-[11px] uppercase tracking-[0.18em]">
              Details
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
