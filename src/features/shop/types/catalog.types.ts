export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  parentId?: string;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryReq {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface BrandReq {
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}
