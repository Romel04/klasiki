"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators/checkout";
import { createOrder } from "@/lib/api/orders";
import { useDistricts, useThanas } from "@/lib/hooks/use-locations";
import { useCartLines, useCartStore, useCartSubtotal } from "@/lib/cart/cart-store";
import { useCartHydrated } from "@/lib/cart/use-cart-hydrated";
import { formatPrice } from "@/lib/format";

const LAST_ORDER_KEY = "klasiki_last_order";

const field =
  "w-full border border-border bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground disabled:opacity-50";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartLines();
  const subtotal = useCartSubtotal();
  const clear = useCartStore((s) => s.clear);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      shippingAddress: "",
      districtId: "",
      thanaId: "",
      specialNotes: "",
    },
  });

  const districtId = watch("districtId");
  const { data: districts } = useDistricts();
  const { data: thanas } = useThanas(districtId);
  const delivery = districts?.find((d) => d.id === districtId)?.deliveryCharge;

  const place = useMutation({
    mutationFn: (values: CheckoutValues) => createOrder(values, lines),
    onSuccess: (order, values) => {
      sessionStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          ...order,
          name: values.customerName,
          phone: values.customerPhone,
          items: lines.map((l) => ({ name: l.name, color: l.color, quantity: l.quantity })),
        }),
      );
      clear();
      router.push("/order-confirmation");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't place your order."),
  });

  if (!hydrated) return <div className="mx-auto max-w-5xl px-6 py-20 text-sm text-muted-foreground">Loading…</div>;

  // After success the cart is cleared before navigating — don't flash "empty".
  if (place.isSuccess) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] hover:bg-foreground hover:text-white transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="mb-10 text-[13px] font-medium uppercase tracking-[0.2em]">Checkout</h1>

      <form onSubmit={handleSubmit((v) => place.mutate(v))} className="grid gap-12 md:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" error={errors.customerName?.message}>
              <input className={field} autoComplete="name" {...register("customerName")} />
            </Field>
            <Field label="Mobile number" error={errors.customerPhone?.message}>
              <input className={field} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" {...register("customerPhone")} />
            </Field>
          </div>

          <Field label="Email (optional)" error={errors.customerEmail?.message}>
            <input className={field} type="email" autoComplete="email" {...register("customerEmail")} />
          </Field>

          <Field label="Delivery address" error={errors.shippingAddress?.message}>
            <textarea className={field} rows={3} placeholder="House, road, area…" {...register("shippingAddress")} />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="District" error={errors.districtId?.message}>
              <select
                className={field}
                {...register("districtId", { onChange: () => setValue("thanaId", "") })}
              >
                <option value="">Select district</option>
                {districts?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Thana (optional)">
              <select className={field} disabled={!districtId} {...register("thanaId")}>
                <option value="">Select thana</option>
                {thanas?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Order notes (optional)">
            <textarea className={field} rows={2} placeholder="Anything we should know?" {...register("specialNotes")} />
          </Field>
        </div>

        <aside className="h-fit border border-border p-6 md:sticky md:top-32">
          <h2 className="mb-5 text-[11px] uppercase tracking-[0.18em]">Order summary</h2>
          <ul className="divide-y divide-border">
            {lines.map((l) => (
              <li key={l.variantId} className="flex gap-3 py-4 first:pt-0">
                <div className="relative h-20 w-16 shrink-0 bg-muted">
                  <Image src={l.image ?? "/samples/bag-1.svg"} alt={l.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-muted-foreground">
                    {l.color} · Qty {l.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(l.unitPrice * l.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Delivery" value={delivery === undefined ? "Select district" : formatPrice(delivery)} />
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal + (delivery ?? 0))}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">Final total is confirmed when your order is placed.</p>

          <p className="mt-6 text-xs text-muted-foreground">Payment: cash on delivery.</p>
          <button
            type="submit"
            disabled={place.isPending}
            className="mt-4 w-full bg-foreground py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            {place.isPending ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.16em]">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
