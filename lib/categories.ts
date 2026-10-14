import type { Category, CategoryNode } from "@/types/category";

export function buildTree(categories: Category[]): CategoryNode[] {
  return categories
    .filter((c) => !c.parentId)
    .map((category) => ({
      category,
      children: categories.filter((c) => c.parentId === category.id),
    }));
}
