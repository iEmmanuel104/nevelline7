import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';

export function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Fetch product from API
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg">Loading product...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Product not found</h2>
                    <button 
                        onClick={() => navigate('/collections')}
                        className="text-blue-500 hover:underline"
                    >
                        Back to Collections
                    </button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity,
            selectedColor: selectedColor || undefined
        });
        navigate('/checkout');
    };

    return (
        <div className="min-h-screen bg-white pt-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative">
                        <img 
                            src={product.image || product.images?.[0] || '/placeholder.png'} 
                            alt={product.name}
                            className="w-full h-[600px] object-cover rounded-lg"
                        />
                        {product.badge && (
                            <div className="absolute top-4 left-4">
                                <Badge variant={product.badge.toLowerCase() as any}>
                                    {product.badge}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold">₦{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ₦{product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                                {product.originalPrice && (
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                                        Save ₦{(product.originalPrice - product.price).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Color</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                selectedColor === color 
                                                    ? 'border-black scale-110' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Size</h3>
                                <div className="flex gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-lg transition-all ${
                                                selectedSize === size 
                                                    ? 'border-black bg-black text-white' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-lg">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Buy Now - ₦{(product.price * quantity).toLocaleString()}
                            </button>
                            
                            <button className="w-full border border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Heart className="w-5 h-5" />
                                Add to Wishlist
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Experience premium quality and style with our {product.name}. 
                                Crafted with attention to detail and designed for comfort, 
                                this piece is perfect for any occasion. Made from high-quality 
                                materials that ensure durability and long-lasting wear.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}