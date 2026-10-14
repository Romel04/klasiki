"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/format";

const LAST_ORDER_KEY = "klasiki_last_order";

interface LastOrder {
  orderNumber: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  name: string;
  phone: string;
  items: { name: string; color: string; quantity: number }[];
}

const subscribe = () => () => {};
const getSnapshot = () => sessionStorage.getItem(LAST_ORDER_KEY);
const getServerSnapshot = () => null;

export default function OrderConfirmationPage() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const order = useMemo<LastOrder | null>(() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">No recent order found on this device.</p>
        <Link href="/track-order" className="mt-6 inline-block text-[11px] uppercase tracking-[0.18em] underline underline-offset-4">
          Track an order
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Thank you, {order.name.split(" ")[0]}</p>
      <h1 className="mt-3 text-2xl font-light">Your order has been placed.</h1>

      <div className="mt-8 border border-border p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Order number</p>
        <p className="mt-1 text-xl font-medium tracking-wide">{order.orderNumber}</p>
        <p className="mt-2 text-xs text-muted-foreground">Save this number — you&apos;ll need it with your phone number to track the order.</p>
      </div>

      <ul className="mt-8 divide-y divide-border text-sm">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex justify-between py-3">
            <span>
              {i.name} <span className="text-muted-foreground">· {i.color}</span>
            </span>
            <span className="text-muted-foreground">× {i.quantity}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd>{formatPrice(order.deliveryCharge)}</dd>
        </div>
        <div className="flex justify-between text-base font-medium">
          <dt>Total (cash on delivery)</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <p className="mt-8 text-sm leading-relaxed text-foreground/80">
        We&apos;ll contact you on <span className="font-medium">{order.phone}</span> to confirm your order. Confirmation is done via bKash.
      </p>

      <div className="mt-10 flex gap-3">
        <Link href="/track-order" className="border border-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] hover:bg-foreground hover:text-white transition-colors">
          Track order
        </Link>
        <Link href="/shop" className="bg-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] text-white hover:bg-foreground/90">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
