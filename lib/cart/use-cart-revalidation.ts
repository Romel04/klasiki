"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProduct } from "@/lib/api/products";
import { unitPriceFor } from "@/lib/product-utils";
import { useCartStore, type CartLineUpdate } from "./cart-store";

const TIMEOUT_MS = 15_000;

// The persisted cart keeps the price/stock from the day an item was added.
// Once per checkout visit, re-check every line against the live product and
// fix prices, clamp quantities, and drop anything gone or sold out.
// Returns `checking` so the checkout can hold the Place order button briefly.
export function useCartRevalidation(ready: boolean) {
  const [done, setDone] = useState(false);
  const hasLines = useCartStore((s) => s.lines.length > 0);

  useEffect(() => {
    if (!ready) return;

    const { lines, reconcile } = useCartStore.getState();
    if (lines.length === 0) return;

    let cancelled = false;
    const ids = [...new Set(lines.map((l) => l.productId))];

    Promise.allSettled(ids.map((id) => getProduct(id, { timeoutMs: TIMEOUT_MS }))).then((results) => {
      if (cancelled) return;
      const products = new Map<string, Awaited<ReturnType<typeof getProduct>> | null>();
      results.forEach((r, i) => {
        if (r.status === "fulfilled") products.set(ids[i], r.value);
        // rejected = network/cold start: leave those lines untouched
      });

      const updates: CartLineUpdate[] = [];
      for (const line of lines) {
        const product = products.get(line.productId);
        if (!product) continue;

        const isBase = line.variantId.startsWith("base-");
        const variant = isBase ? undefined : product.variants.find((v) => v.id === line.variantId);
        if (!isBase && !variant) {
          updates.push({ variantId: line.variantId, remove: true });
          continue;
        }
        const stock = variant ? variant.stock : product.stockQty;
        if (stock <= 0) {
          updates.push({ variantId: line.variantId, remove: true });
          continue;
        }
        const price = unitPriceFor(product, variant);
        if (price !== line.unitPrice || stock !== line.maxStock || line.quantity > stock) {
          updates.push({ variantId: line.variantId, unitPrice: price, maxStock: stock });
        }
      }

      if (updates.length > 0) {
        reconcile(updates);
        toast.message("Your cart was updated to match current prices and availability.");
      }
      setDone(true);
    });

    const timer = setTimeout(() => setDone(true), TIMEOUT_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready]);

  // Only "checking" while there is something to check and we haven't finished.
  return { checking: ready && hasLines && !done };
}
