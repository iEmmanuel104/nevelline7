import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Plus, Edit, Trash2, Folder, Image } from 'lucide-react';
import api from '../../lib/api';

interface Category {
  _id: string;
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
}

const categoryService = {
  async getCategories() {
    const { data } = await api.get('/categories');
    return data;
  },

  async createCategory(category: Partial<Category>) {
    const { data } = await api.post('/categories', category);
    return data;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },

  async deleteCategory(id: string) {
    await api.delete(`/categories/${id}`);
  }
};

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading categories...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.categories?.map((category: Category) => (
            <Card key={category._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Folder className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {category.productCount || 0} products
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {category.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-gray-400">Order: {category.order}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

// Category Modal Component
function CategoryModal({ 
  category, 
  onClose 
}: { 
  category: Category | null; 
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    icon: category?.icon || '',
    active: category?.active ?? true,
    order: category?.order || 0,
  });

  const [imageUploadConfig, setImageUploadConfig] = useState(null);

  React.useEffect(() => {
    // Get Cloudinary config for categories
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/uploads/config?type=categories');
        setImageUploadConfig(data.config);
      } catch (error) {
        console.error('Failed to get upload config:', error);
      }
    };
    fetchConfig();
  }, []);

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Category>) => 
      categoryService.updateCategory(category!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleImageUpload = () => {
    if (!imageUploadConfig || !(window as any).cloudinary) {
      alert('Cloudinary not configured. Please check your setup.');
      return;
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      imageUploadConfig,
      (error: any, result: any) => {
        if (error) {
          console.error('Upload error:', error);
          return;
        }
        
        if (result?.event === "success") {
          setFormData(prev => ({
            ...prev,
            image: result.info.secure_url
          }));
        }
      }
    );
    
    widget.open();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Men's Wear"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category Image</label>
            <div className="flex items-center gap-3">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Category preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Image URL or upload using Cloudinary"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleImageUpload}
                className="px-3"
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon (Optional)</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Icon name or emoji"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active (visible to customers)
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {category ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}