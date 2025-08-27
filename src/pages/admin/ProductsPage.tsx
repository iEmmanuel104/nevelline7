import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingStock, setEditingStock] = useState<{productId: string, stock: number} | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search }],
    queryFn: () => productService.getProducts({ 
      page, 
      limit: 10, 
      search: search || undefined 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productService.updateProduct(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    await toggleStatusMutation.mutateAsync({ 
      id: product._id, 
      isActive: !product.isActive 
    });
  };

  const handleStockEdit = (productId: string, currentStock: number) => {
    setEditingStock({ productId, stock: currentStock });
  };

  const handleStockSave = async (productId: string, newStock: number) => {
    try {
      await productService.updateProduct(productId, { stock: newStock });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingStock(null);
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleStockCancel = () => {
    setEditingStock(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Visibility</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="relative">
                        <img
                          src={product.image || product.images?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                        {product.badge && (
                          <span className={`absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded-full text-white text-[10px] ${
                            product.badge === 'NEW' ? 'bg-green-500' :
                            product.badge === 'SALE' ? 'bg-red-500' :
                            product.badge === 'HOT' ? 'bg-orange-500' :
                            product.badge === 'SOLD OUT' ? 'bg-gray-600' : 'bg-gray-500'
                          }`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">
                      <span className="text-sm capitalize">
                        {product.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">₦{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      {editingStock?.productId === product._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingStock.stock}
                            onChange={(e) => setEditingStock({
                              ...editingStock,
                              stock: Number(e.target.value)
                            })}
                            className="w-16 px-2 py-1 border rounded text-sm"
                            min="0"
                            autoFocus
                          />
                          <button
                            onClick={() => handleStockSave(product._id, editingStock.stock)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleStockCancel}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStockEdit(product._id, product.stock || 0)}
                          className={`hover:bg-gray-50 px-2 py-1 rounded transition-colors ${
                            (product.stock || 0) < 10 ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {product.stock || 0}
                          {(product.stock || 0) < 10 && (
                            <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">
                              Low
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {product.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {product.isActive ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => window.open(`/admin/products/${product._id}`, '_blank')}
                          className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="View Full Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
                          title="Quick Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.pagination && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={!data.pagination.hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!data.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Product Modal would go here */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ 
  product, 
  onClose 
}: { 
  product: Product | null; 
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: product?.category || 'mens-wear' as const,
    description: product?.description || '',
    stock: product?.stock || 0,
    images: product?.images || [''],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    tags: product?.tags || [],
    badge: product?.badge || undefined,
  });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => 
      productService.updateProduct(product!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price</label>
              <Input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="mens-wear">Men's Wear</option>
                <option value="womens-wear">Women's Wear</option>
                <option value="kids-wear">Kids Wear</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <Input
              value={formData.images[0]}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}