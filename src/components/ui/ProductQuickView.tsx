import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, MessageCircle, Heart } from 'lucide-react';
import { Badge } from './Badge';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';
import { cn } from '../../lib/utils';

interface ProductQuickViewProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            setSelectedColor(null);
            setCurrentImage(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const images = [
        product.image, 
        ...(product.backImage ? [product.backImage] : []),
        ...(product.gallery || [])
    ].filter(Boolean);

    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity,
            selectedColor: selectedColor || undefined
        });
        onClose();
    };

    const handleWhatsAppContact = () => {
        const message = `Hi Nevelline! I'm interested in purchasing the ${product.name} (₦${product.price.toLocaleString()}). Can you please provide more details?`;
        const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handlePayNow = () => {
        // Add to cart first
        addToCart({
            ...product,
            quantity,
            selectedColor: selectedColor || undefined
        });
        
        // Close the modal
        onClose();
        
        // Navigate to checkout page where user can enter their details
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Images */}
                    <div className="relative">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-100">
                            <img
                                src={images[currentImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Badges */}
                            {product.badge && (
                                <div className="absolute top-4 left-4">
                                    <Badge variant={product.badge.toLowerCase() as any}>
                                        {product.badge}
                                    </Badge>
                                </div>
                            )}
                            
                            {/* Heart Icon */}
                            <button
                                onClick={handleAddToCart}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                            >
                                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        {/* Image Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-4">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={cn(
                                            "w-16 h-16 rounded border-2 overflow-hidden transition-all",
                                            currentImage === index ? "border-black" : "border-gray-200"
                                        )}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
                        
                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-bold text-black">₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                    ₦{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                                <div className="flex gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border-2 transition-all",
                                                selectedColor === color 
                                                    ? "border-black scale-110" 
                                                    : "border-gray-300 hover:border-gray-400"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-lg font-bold">
                                    Total: ₦{(product.price * quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handlePayNow}
                                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Pay Now - ₦{(product.price * quantity).toLocaleString()}
                            </button>
                            
                            <button
                                onClick={handleWhatsAppContact}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact us on WhatsApp
                            </button>
                            
                            <button
                                onClick={handleAddToCart}
                                className="w-full border border-gray-300 text-gray-900 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Experience premium quality and style with our {product.name}. 
                                Crafted with attention to detail and designed for comfort, 
                                this piece is perfect for any occasion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};