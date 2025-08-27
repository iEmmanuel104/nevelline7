import api from '../lib/api';

export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  active: boolean;
  order: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
  // Frontend compatibility
  link?: string;
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories');
    // Transform for frontend compatibility
    return (data.categories || []).map((cat: Category) => ({
      ...cat,
      id: cat._id,
      link: `/collections/${cat.slug}`
    }));
  }

  async getCategory(id: string): Promise<Category> {
    const { data } = await api.get(`/categories/${id}`);
    return {
      ...data.category,
      id: data.category._id,
      link: `/collections/${data.category.slug}`
    };
  }

  async createCategory(category: Partial<Category>): Promise<{ category: Category }> {
    const { data } = await api.post('/categories', category);
    return data;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<{ category: Category }> {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();