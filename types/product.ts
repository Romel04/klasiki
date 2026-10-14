export interface ProductImage {
  url: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  color: string;
  stock: number;
  price?: number;
  discountPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  categoryName?: string;
  isFeatured: boolean;
  isBestSelling: boolean;
  isNewArrival: boolean;
  stockQty: number;
  // Empty on the list endpoint; filled on GET /products/{id}.
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Confirmed from Swagger: these are the only params GET /products accepts.
export interface ProductQuery {
  page?: number;
  limit?: number;
  category_id?: string;
  search?: string;
  is_featured?: boolean;
  is_best_selling?: boolean;
  is_new_arrival?: boolean;
  is_active?: boolean;
}
