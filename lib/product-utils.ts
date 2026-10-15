import type { Product, ProductVariant } from "@/types/product";

// Swap-in point: real Cloudinary URLs win; otherwise a stable local sample.
export function getProductImage(p: Product, index = 0): string {
  return p.images[index]?.url ?? `/samples/bag-${(Number(p.id) % 4) + 1}.svg`;
}

export function getCategoryImage(imageUrl: string | null | undefined, id: string): string {
  return imageUrl ?? `/samples/bag-${(Number(id) % 4) + 1}.svg`;
}

export function getUnitPrice(p: Product) {
  return p.discountPrice ?? p.price;
}

// Price a customer pays per unit for a given variant (variant overrides win).
export function unitPriceFor(p: Product, v?: ProductVariant) {
  return v?.discountPrice ?? v?.price ?? p.discountPrice ?? p.price;
}
