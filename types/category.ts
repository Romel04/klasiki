export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface CategoryNode {
  category: Category;
  children: Category[];
}
