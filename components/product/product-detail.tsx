"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/lib/cart/cart-store";
import { getProductImage, unitPriceFor } from "@/lib/product-utils";
import { formatPrice } from "@/lib/format";
import { categoryPath } from "@/lib/slug";
import { swatchColor } from "@/lib/colors";

export function ProductDetail({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);

  // A product with no variants can still be bought: use a synthetic "base-…"
  // variant id (checkout must send product_variant_id as undefined for these).
  const hasVariants = product.variants.length > 0;
  const variants: ProductVariant[] = hasVariants
    ? product.variants
    : [{ id: `base-${product.id}`, color: "Standard", stock: product.stockQty }];

  const [variantId, setVariantId] = useState(
    () => (variants.find((v) => v.stock > 0) ?? variants[0]).id,
  );
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const original = selected.price ?? product.price;
  const unit = unitPriceFor(product, hasVariants ? selected : undefined);
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

  const addLabel = soldOut ? "Sold out" : "Add to cart";

  return (
    <>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 pb-28 md:grid-cols-2 md:gap-14 md:px-6 md:py-14 md:pb-14">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === imgIndex}
                  className={`relative h-20 w-16 shrink-0 border bg-muted ${
                    i === imgIndex ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
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
              href={categoryPath({ id: product.categoryId, name: product.categoryName })}
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:underline"
            >
              {product.categoryName}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-3xl font-medium leading-tight md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg">
            {onSale ? (
              <>
                <span className="font-medium text-sale">{formatPrice(unit)}</span>{" "}
                <span className="text-sm text-muted-foreground line-through">{formatPrice(original)}</span>
              </>
            ) : (
              <span className="font-medium">{formatPrice(unit)}</span>
            )}
          </p>

          {hasVariants && (
            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em]">
                Color: <span className="text-muted-foreground">{selected.color}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => (
                  <VariantOption
                    key={v.id}
                    variant={v}
                    selected={v.id === variantId}
                    onSelect={() => {
                      setVariantId(v.id);
                      setQty(1);
                    }}
                  />
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
              <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(selected.stock, q + 1))}
                disabled={qty >= selected.stock}
                className="h-11 w-11 hover:bg-muted disabled:opacity-40"
              >
                +
              </button>
            </div>
            <p className={`text-xs ${!soldOut && selected.stock <= 5 ? "text-sale" : "text-muted-foreground"}`}>
              {soldOut ? "Out of stock" : selected.stock <= 5 ? `Only ${selected.stock} left` : "In stock"}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={soldOut}
            className="mt-6 w-full bg-foreground py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-muted-foreground"
          >
            {addLabel}
          </button>

          <p className="mt-4 text-xs text-muted-foreground">
            Cash on delivery. Delivery charge is added at checkout by district.
          </p>

          <div className="mt-10 border-t border-border">
            {product.description && (
              <Section title="Details" defaultOpen>
                <p className="whitespace-pre-line">{product.description}</p>
              </Section>
            )}
            <Section title="Delivery" defaultOpen={!product.description}>
              <p>
                Cash on delivery across Bangladesh. The delivery charge depends on your district and is shown
                at checkout before you place the order.
              </p>
            </Section>
            <Section title="Exchange & returns">
              <p>
                See our{" "}
                <Link href="/exchange-return" className="underline underline-offset-4">
                  exchange and return policy
                </Link>
                .
              </p>
            </Section>
          </div>
        </div>
      </div>

      {/* Sticky add-to-cart (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-border bg-background px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <p className="text-sm font-medium">{formatPrice(unit)}</p>
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="flex-1 bg-foreground py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-background disabled:cursor-not-allowed disabled:bg-muted-foreground"
        >
          {addLabel}
        </button>
      </div>
    </>
  );
}

function VariantOption({
  variant,
  selected,
  onSelect,
}: {
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  const out = variant.stock <= 0;
  const hex = swatchColor(variant.color);

  if (!hex) {
    // Unknown colour name: fall back to a text chip.
    return (
      <button
        onClick={onSelect}
        disabled={out}
        aria-pressed={selected}
        className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground disabled:line-through ${
          selected ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
        }`}
      >
        {variant.color}
      </button>
    );
  }

  return (
    <button
      onClick={onSelect}
      disabled={out}
      aria-pressed={selected}
      aria-label={out ? `${variant.color} (sold out)` : variant.color}
      title={out ? `${variant.color} — sold out` : variant.color}
      className={`relative h-9 w-9 border border-border p-0.5 transition-colors disabled:cursor-not-allowed ${
        selected ? "outline outline-1 outline-offset-2 outline-foreground" : "hover:border-foreground"
      }`}
    >
      <span className="block h-full w-full" style={{ backgroundColor: hex }} />
      {out && (
        <span className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_47%,#9ca3af_47%,#9ca3af_53%,transparent_53%)]" />
      )}
    </button>
  );
}

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group/section border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] uppercase tracking-[0.18em] [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-base leading-none group-open/section:hidden">+</span>
        <span aria-hidden className="hidden text-base leading-none group-open/section:inline">−</span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-foreground/80">{children}</div>
    </details>
  );
}
