// Mirrors ProductResponse from product-service's src/services/product.service.ts exactly - the backend already converts snake_case DB columns to camelCase before sending anything over the wire, so this type can be a 1:1 copy of what actually arrives, no mapping needed on our side.
export interface Product {
  id: string;
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  categoryId: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  ingredients: string;
  usageNotes: string;
  benefits: string;
  precautions: string;
  quantity: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListParams {
  categoryId?: string;
  search?: string;
  page?: number;
  isFeatured?: boolean;
}