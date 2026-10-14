import type { CartLine } from "@/lib/cart/cart-store";
import type { CheckoutValues } from "@/lib/validators/checkout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function errorMessage(res: Response, fallback: string) {
  try {
    const json = await res.json();
    const m = json?.message;
    if (Array.isArray(m)) return m.join(", ");
    if (typeof m === "string" && m) return m;
  } catch {}
  return fallback;
}

// ---------------------------------------------------------------- create ---

export interface PlacedOrder {
  orderNumber: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

export async function createOrder(values: CheckoutValues, lines: CartLine[]): Promise<PlacedOrder> {
  // The admin parses a "Source: X" prefix out of special_notes — keep that convention.
  const notes = values.specialNotes?.trim();
  const payload = {
    customer_name: values.customerName,
    customer_phone: values.customerPhone.replace(/[\s-]/g, ""),
    customer_email: values.customerEmail || undefined,
    shipping_district_id: Number(values.districtId),
    shipping_thana_id: values.thanaId ? Number(values.thanaId) : undefined,
    shipping_address: values.shippingAddress,
    special_notes: notes ? `Source: Website — ${notes}` : "Source: Website",
    items: lines.map((l) => ({
      product_id: Number(l.productId),
      // Products without variants use a synthetic "base-…" id in the cart.
      product_variant_id: l.variantId.startsWith("base-") ? undefined : Number(l.variantId),
      quantity: l.quantity,
    })),
  };

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "We couldn't place your order. Please try again."));

  const json = await res.json();
  const o = json.data;
  return {
    orderNumber: String(o.order_number),
    subtotal: Number(o.subtotal),
    deliveryCharge: Number(o.delivery_charge),
    total: Number(o.total),
  };
}

// ----------------------------------------------------------------- track ---

export interface TrackedOrder {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; quantity: number; total: number }[];
  history: { status: string; note: string | null; createdAt: string }[];
}

export const NOT_FOUND = "NOT_FOUND";

// ⚠ PATH UNCONFIRMED. Swagger has "track by order number + phone" but I have not
// seen the exact path/params. Guess below — if it 404s for a real order, check
// Swagger and fix ONLY this function.
export async function trackOrder(orderNumber: string, phone: string): Promise<TrackedOrder> {
  const qs = new URLSearchParams({ order_number: orderNumber.trim(), phone: phone.replace(/[\s-]/g, "") });
  const res = await fetch(`${API_URL}/orders/track?${qs}`);
  if (res.status === 404) throw new Error(NOT_FOUND);
  if (!res.ok) throw new Error(await errorMessage(res, "We couldn't look up that order. Please try again."));

  const o = (await res.json()).data;
  return {
    orderNumber: String(o.order_number),
    status: o.status,
    total: Number(o.total),
    createdAt: o.created_at,
    items: (o.items ?? []).map((i: { product_name: string; quantity: number; total_price: string }) => ({
      name: i.product_name,
      quantity: i.quantity,
      total: Number(i.total_price),
    })),
    history: (o.statusHistory ?? [])
      .map((h: { status: string; note: string | null; created_at: string }) => ({
        status: h.status,
        note: h.note,
        createdAt: h.created_at,
      }))
      .sort((a: { createdAt: string }, b: { createdAt: string }) => a.createdAt.localeCompare(b.createdAt)),
  };
}
