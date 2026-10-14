"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { NOT_FOUND, trackOrder } from "@/lib/api/orders";
import { formatPrice } from "@/lib/format";

const field =
  "w-full border border-border bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

const LABELS: Record<string, string> = {
  pending: "Order placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");

  const track = useMutation({
    mutationFn: () => trackOrder(orderNumber, phone),
  });
  const order = track.data;

  const errorText =
    track.error instanceof Error
      ? track.error.message === NOT_FOUND
        ? "We couldn't find an order with that number and phone. Please check both and try again."
        : track.error.message
      : null;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:py-24">
      <h1 className="text-[13px] font-medium uppercase tracking-[0.2em]">
        Track your order
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter your order number and the phone number you used at checkout.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (orderNumber.trim() && phone.trim()) track.mutate();
        }}
        className="mt-8 space-y-5"
      >
        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em]">
            Order number
          </span>
          <input
            className={field}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em]">
            Phone number
          </span>
          <input
            className={field}
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={track.isPending}
          className="w-full bg-foreground py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white hover:bg-foreground/90 disabled:opacity-60"
        >
          {track.isPending ? "Looking up…" : "Track order"}
        </button>
      </form>

      {errorText && (
        <p className="mt-6 text-sm text-destructive">{errorText}</p>
      )}

      {order && (
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-medium">{order.orderNumber}</p>
            <span className="border border-foreground px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
              {LABELS[order.status] ?? order.status}
            </span>
          </div>

          <ol className="mt-8 space-y-6 border-l border-border pl-6">
            {order.history.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2 w-2 bg-foreground" />
                <p className="text-sm font-medium">
                  {LABELS[h.status] ?? h.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(h.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                {h.note && (
                  <p className="mt-1 text-sm text-foreground/80">{h.note}</p>
                )}
              </li>
            ))}
          </ol>

          <ul className="mt-10 divide-y divide-border text-sm">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between py-3">
                <span>
                  {i.name}{" "}
                  <span className="text-muted-foreground">× {i.quantity}</span>
                </span>
                <span>{formatPrice(i.total)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-border pt-3 text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
