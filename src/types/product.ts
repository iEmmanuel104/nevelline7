// Unified Product interface for the entire frontend
export interface Product {
  _id: string;
  id?: string; // For frontend compatibility
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: 'mens-wear' | 'womens-wear' | 'kids-wear' | 'accessories' | 'mens-shoes';
  
  // Images - supporting both old and new formats
  image?: string; // Main image (legacy)
  backImage?: string; // Back view image
  gallery?: string[]; // Gallery images
  images?: string[]; // All images combined (admin format)
  
  colors?: string[];
  sizes?: string[];
  stock?: number;
  description?: string;
  tags?: string[];
  badge?: 'NEW' | 'SALE' | 'HOT' | 'SOLD OUT';
  isActive?: boolean;
  views?: number;
  purchases?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  id: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}