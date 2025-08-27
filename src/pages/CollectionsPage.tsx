import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductQuickView } from '../components/ui/ProductQuickView';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { Product } from '../types/product';

export function CollectionsPage() {
    const { category } = useParams<{ category: string }>();
    const [selectedCategory, setSelectedCategory] = useState(category || 'all');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Update selected category when URL changes
    useEffect(() => {
        setSelectedCategory(category || 'all');
    }, [category]);

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    // Fetch products based on selected category
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products', selectedCategory],
        queryFn: async () => {
            if (selectedCategory === 'all') {
                const { products } = await productService.getProducts({ limit: 20 });
                return products;
            } else {
                return await productService.getProductsByCategory(selectedCategory);
            }
        },
    });

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-center mb-2">Our Collections</h1>
                    <p className="text-gray-600 text-center">Discover our amazing products</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2 rounded-full transition-all ${
                            selectedCategory === 'all' 
                                ? 'bg-black text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-6 py-2 rounded-full transition-all ${
                                selectedCategory === cat.slug
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading products...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product._id} 
                                product={{
                                    ...product,
                                    id: product._id,
                                    image: product.image || product.images?.[0] || ''
                                }} 
                                onQuickView={handleQuickView}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && products.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">
                            {selectedCategory === 'all' 
                                ? 'No products are currently available.' 
                                : `No products found in ${selectedCategory} category.`}
                        </p>
                    </div>
                )}

                {/* Quick View Modal */}
                <ProductQuickView
                    product={quickViewProduct}
                    isOpen={isQuickViewOpen}
                    onClose={closeQuickView}
                />
            </div>
        </div>
    );
}