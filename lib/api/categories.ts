import type { Category } from "@/types/category";
import { apiJson } from "./http";

interface ApiCategory {
  id: string | number;
  name: string;
  parent_id: string | number | null;
  image_url: string | null;
  is_active: boolean;
}

function fromApi(c: ApiCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    parentId: c.parent_id != null ? String(c.parent_id) : null,
    imageUrl: c.image_url,
    isActive: c.is_active,
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiJson<ApiCategory[]>(
    "/categories",
    { next: { revalidate: 60 } },
    "Failed to fetch categories",
  );
  return data.map(fromApi).filter((c) => c.isActive !== false);
}
