import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductQuickView } from '../components/ui/ProductQuickView';
import { categories, mensProducts, womensProducts, kidsProducts, trendingProducts, featuredProducts } from '../data/mockData';
import type { Product } from '../types';

export function CollectionsPage() {
    const { category } = useParams<{ category: string }>();
    const [selectedCategory, setSelectedCategory] = useState(category || 'all');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    const getProductsByCategory = (): Product[] => {
        switch (selectedCategory) {
            case 'mens-wear':
                return mensProducts;
            case 'womens-wear':
                return womensProducts;
            case 'kids-wear':
                return kidsProducts;
            case 'accessories':
                return featuredProducts;
            default:
                return [...trendingProducts, ...featuredProducts, ...mensProducts.slice(0, 2), ...womensProducts.slice(0, 2)];
        }
    };

    const products = getProductsByCategory();

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
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.link.split('/').pop()!)}
                            className={`px-6 py-2 rounded-full transition-all ${
                                selectedCategory === cat.link.split('/').pop()
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onQuickView={handleQuickView}
                        />
                    ))}
                </div>

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