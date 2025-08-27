import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { ProductImageUpload, GalleryUpload } from '../../components/ui/CloudinaryUpload';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Plus,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Tag,
  Package,
  DollarSign,
  Palette,
  Ruler
} from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Size management
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [sizeInput, setSizeInput] = useState('');
  
  // Color management
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorInput, setColorInput] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
  });

  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        image: product.image || (product.images && product.images[0]) || '',
        backImage: product.backImage || (product.images && product.images[1]) || '',
        gallery: product.gallery || (product.images ? product.images.slice(2) : []),
        description: product.description,
        stock: product.stock,
        colors: product.colors || [],
        sizes: product.sizes || [],
        isActive: product.isActive ?? true,
        badge: product.badge,
      });
    }
  }, [product]);

  // Cloudinary is now handled by the CloudinaryUpload component

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productService.updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => productService.deleteProduct(id!),
    onSuccess: () => {
      navigate('/admin/products');
    },
  });

  const handleSave = async () => {
    await updateMutation.mutateAsync(formData);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await deleteMutation.mutateAsync();
    }
  };

  // Image upload handlers for the CloudinaryUpload components
  const handleMainImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleBackImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, backImage: imageUrl }));
  };

  const handleBackImageRemove = () => {
    setFormData(prev => ({ ...prev, backImage: '' }));
  };

  const handleGalleryImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), imageUrl]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || []
    }));
  };

  // Color management
  const commonColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#000080', '#008000', '#800000', '#808000', '#008080',
    '#C0C0C0', '#FF69B4', '#FFD700', '#98FB98', '#DDA0DD', '#F0E68C'
  ];

  const addColor = (color?: string) => {
    const colorToAdd = color || colorInput;
    if (colorToAdd && /^#[0-9A-F]{6}$/i.test(colorToAdd)) {
      if (!(formData.colors || []).includes(colorToAdd)) {
        setFormData(prev => ({
          ...prev,
          colors: [...(prev.colors || []), colorToAdd]
        }));
        setColorInput('');
        setShowColorPicker(false);
      }
    } else if (colorToAdd) {
      alert('Please enter a valid hex color code (e.g., #FF0000)');
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index) || []
    }));
  };

  // Size management - NO MORE PROMPTS!
  const addSize = () => {
    if (sizeInput && sizeInput.trim()) {
      if (!(formData.sizes || []).includes(sizeInput.trim())) {
        setFormData(prev => ({
          ...prev,
          sizes: [...(prev.sizes || []), sizeInput.trim()]
        }));
        setSizeInput('');
        setShowSizeInput(false);
      }
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.filter((_, i) => i !== index) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500">ID: {product._id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              product.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {product.isActive ? 'Live' : 'Hidden'}
            </div>
            
            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Management */}
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Images
                  </h3>
                </div>
                
                {/* Front and Back Images */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Front Image */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">Front Image *</label>
                      {isEditing && (
                        <span className="text-xs text-gray-500">Required - Main product view</span>
                      )}
                    </div>
                    {isEditing ? (
                      <ProductImageUpload
                        onUpload={handleMainImageUpload}
                        currentImage={formData.image}
                        buttonText="Change Front Image"
                        showPreview={true}
                        previewClassName="w-full aspect-square object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={product.image || '/placeholder.png'}
                          alt={`${product.name} - Front`}
                          className="w-full aspect-square object-cover rounded-lg border"
                        />
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Front
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back Image */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">Back Image</label>
                      {isEditing && (
                        <span className="text-xs text-gray-500">Optional - Back view</span>
                      )}
                    </div>
                    {isEditing ? (
                      <ProductImageUpload
                        onUpload={handleBackImageUpload}
                        onRemove={handleBackImageRemove}
                        currentImage={formData.backImage}
                        buttonText="Add Back Image"
                        showPreview={true}
                        previewClassName="w-full aspect-square object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="relative">
                        {product.backImage ? (
                          <>
                            <img
                              src={product.backImage}
                              alt={`${product.name} - Back`}
                              className="w-full aspect-square object-cover rounded-lg border"
                            />
                            <div className="absolute bottom-2 left-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                              Back
                            </div>
                          </>
                        ) : (
                          <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No back image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">Gallery Images</label>
                    {isEditing && (
                      <GalleryUpload
                        onUpload={handleGalleryImageUpload}
                        buttonText="Add Gallery Image"
                        buttonSize="sm"
                        showPreview={false}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(isEditing ? (formData.gallery || []) : (product?.gallery || [])).map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border"
                        />
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Gallery {index + 1}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!product.gallery || product.gallery.length === 0) && !isEditing && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No gallery images
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              {isEditing ? (
                <textarea
                  className="w-full border rounded-lg px-3 py-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available'}
                </p>
              )}
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{product.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  {isEditing ? (
                    <select
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                    >
                      <option value="mens-wear">Men's Wear</option>
                      <option value="womens-wear">Women's Wear</option>
                      <option value="kids-wear">Kids Wear</option>
                      <option value="accessories">Accessories</option>
                      <option value="mens-shoes">Men's Shoes</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{product.category?.replace('-', ' ')}</p>
                  )}
                </div>

                {/* Visibility Toggle */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Visibility</label>
                      <p className="text-xs text-gray-500">Control if customers can see this product</p>
                    </div>
                    {isEditing ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    ) : (
                      <div className={`flex items-center gap-2 px-2 py-1 rounded ${
                        product.isActive ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'
                      }`}>
                        {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span className="text-sm">{product.isActive ? 'Visible' : 'Hidden'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Stock
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      />
                    ) : (
                      <p className="text-xl font-bold text-gray-900">₦{product.price?.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      />
                    ) : (
                      <p className="text-lg text-gray-500">
                        {product.originalPrice ? `₦${product.originalPrice.toLocaleString()}` : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      min="0"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-medium ${
                        (product.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock || 0} units
                      </span>
                      {(product.stock || 0) < 10 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Colors */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Colors
                </h3>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                )}
              </div>

              {/* Color Picker Modal */}
              {showColorPicker && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Color (Hex)</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="#FF0000"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addColor()}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => addColor()}>
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Colors</label>
                      <div className="grid grid-cols-8 gap-2">
                        {commonColors.map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => addColor(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowColorPicker(false)}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}

              {/* Color Display */}
              <div className="flex gap-2 flex-wrap">
                {(isEditing ? formData.colors || [] : product.colors || []).map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    {isEditing && (
                      <button
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => removeColor(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                {(!product.colors || product.colors.length === 0) && !isEditing && (
                  <p className="text-gray-500 text-sm">No colors defined</p>
                )}
              </div>
            </Card>

            {/* Sizes */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Sizes
                </h3>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSizeInput(!showSizeInput)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                )}
              </div>

              {/* Size Input Modal */}
              {showSizeInput && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enter Size</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., S, M, L, 32, 34"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSize()}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={addSize}>
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Add</label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                              key={size}
                              className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                              onClick={() => {
                                setSizeInput(size);
                                setTimeout(() => addSize(), 0);
                              }}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {['28', '30', '32', '34', '36', '38', '40', '42'].map((size) => (
                            <button
                              key={size}
                              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                              onClick={() => {
                                setSizeInput(size);
                                setTimeout(() => addSize(), 0);
                              }}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowSizeInput(false);
                        setSizeInput('');
                      }}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}

              {/* Size Display */}
              <div className="flex gap-2 flex-wrap">
                {(isEditing ? formData.sizes || [] : product.sizes || []).map((size, index) => (
                  <div key={index} className="relative group">
                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 border border-blue-200 text-blue-700">
                      {size}
                      {isEditing && (
                        <button
                          className="ml-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                          onClick={() => removeSize(index)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
                {(!product.sizes || product.sizes.length === 0) && !isEditing && (
                  <p className="text-gray-500 text-sm">No sizes defined</p>
                )}
              </div>
            </Card>

            {/* Badge */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Product Badge
              </h3>
              
              {isEditing ? (
                <div className="space-y-3">
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: (e.target.value || undefined) as Product['badge'] }))}
                  >
                    <option value="">No Badge</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT</option>
                    <option value="SOLD OUT">SOLD OUT</option>
                  </select>
                  
                  {/* Badge Preview */}
                  {formData.badge && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Store Display Preview:</p>
                      <div className="inline-block relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <span className={`absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full text-white font-medium ${
                          formData.badge === 'NEW' ? 'bg-green-500' :
                          formData.badge === 'SALE' ? 'bg-red-500' :
                          formData.badge === 'HOT' ? 'bg-orange-500' :
                          formData.badge === 'SOLD OUT' ? 'bg-gray-600' : 'bg-gray-500'
                        }`}>
                          {formData.badge}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {product.badge ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${
                        product.badge === 'NEW' ? 'bg-green-500' :
                        product.badge === 'SALE' ? 'bg-red-500' :
                        product.badge === 'HOT' ? 'bg-orange-500' :
                        product.badge === 'SOLD OUT' ? 'bg-gray-600' : 'bg-gray-500'
                      }`}>
                        {product.badge}
                      </span>
                      <span className="text-sm text-gray-600">Active badge</span>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No badge assigned</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}