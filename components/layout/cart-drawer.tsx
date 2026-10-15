"use client";

import Link from "next/link";
import { useEffect } from "react";
import { productPath } from "@/lib/slug";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import {
  useCartLines,
  useCartStore,
  useCartSubtotal,
} from "@/lib/cart/cart-store";
import { formatPrice } from "@/lib/format";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lines = useCartLines();
  const subtotal = useCartSubtotal();
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <span className="text-[11px] uppercase tracking-[0.18em]">Cart ({lines.length})</span>
          <button aria-label="Close cart" onClick={onClose} className="p-1.5">
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.18em] hover:bg-foreground hover:text-background transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-4 py-5">
                  <Link href={productPath({ id: l.productId, name: l.name })} onClick={onClose} className="relative h-28 w-22 shrink-0 bg-muted">
                    <Image
                      src={l.image ?? "/samples/bag-1.svg"}
                      alt={l.name}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between text-sm">
                    <div>
                      <p className="font-medium">{l.name}</p>
                      <p className="text-muted-foreground">{l.color}</p>
                      <p className="mt-1">{formatPrice(l.unitPrice)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(l.variantId, l.quantity - 1)}
                          className="h-8 w-8 hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{l.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(l.variantId, l.quantity + 1)}
                          disabled={l.quantity >= l.maxStock}
                          className="h-8 w-8 hover:bg-muted disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(l.variantId)}
                        className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border p-5">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Delivery charge is added at checkout based on your district.
              </p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block bg-foreground py-3.5 text-center text-[11px] uppercase tracking-[0.18em] text-background hover:bg-foreground/90"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
