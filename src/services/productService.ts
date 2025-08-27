import api from '../lib/api';
import type { Product, ProductFilters, ProductsResponse } from '../types/product';

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const { data } = await api.get('/products', { params: filters });
    return data;
  }

  async getProduct(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data.product || data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await api.get('/products/featured');
    return data.products || [];
  }

  async getTrendingProducts(): Promise<Product[]> {
    const { data } = await api.get('/products/trending');
    return data.products || [];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data } = await api.get(`/products/category/${category}`);
    return data.products || [];
  }

  async createProduct(product: Partial<Product>): Promise<{ product: Product }> {
    const { data } = await api.post('/products', product);
    return data;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<{ product: Product }> {
    const { data } = await api.put(`/products/${id}`, product);
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  async bulkUploadProducts(products: Partial<Product>[]): Promise<{ products: Product[] }> {
    const { data } = await api.post('/products/bulk-upload', { products });
    return data;
  }

  async getProductStats(): Promise<any> {
    const { data } = await api.get('/products/stats/overview');
    return data;
  }
}

export const productService = new ProductService();