import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "../../types";
import { Badge } from "./Badge";
import { cn } from "../../lib/utils";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
    product: Product;
    className?: string;
    onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className, onQuickView }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = React.useState(false);

    const badgeVariant = product.badge?.toLowerCase().replace(" ", "") as any;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({ ...product, quantity: 1 });
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product);
        }
    };


    return (
        <div
            className={cn("product-card group relative bg-white rounded-sm overflow-hidden", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge */}
            {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={badgeVariant}>{product.badge}</Badge>
                </div>
            )}

            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-3 right-3 z-10">
                    <Badge variant="discount">-{product.discount}%</Badge>
                </div>
            )}

            {/* Image Container with Flip Animation */}
            <div className="relative h-80 overflow-hidden bg-gray-50">
                <div className="relative w-full h-full [perspective:1000px]">
                    {/* Front Image */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-all duration-700 [backface-visibility:hidden]",
                            isHovered && product.backImage ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                        )}
                    />
                    
                    {/* Back Image */}
                    {product.backImage && (
                        <img
                            src={product.backImage}
                            alt={`${product.name} back view`}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover transition-all duration-700 [backface-visibility:hidden] [transform:rotateY(-180deg)]",
                                isHovered ? "[transform:rotateY(0deg)]" : "[transform:rotateY(-180deg)]"
                            )}
                        />
                    )}
                </div>

                {/* Heart Button - Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all z-20 hover:scale-110"
                >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Quick Actions Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                >
                    <button 
                        onClick={handleQuickView}
                        className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                        title="Quick View"
                    >
                        <Eye className="h-5 w-5 text-gray-700" />
                    </button>
                    <button 
                        onClick={handleAddToCart}
                        className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                        title="Add to Cart"
                    >
                        <ShoppingBag className="h-5 w-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 text-center">
                <h3 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-medium text-gray-900 mb-3 hover:text-red-500 transition-colors cursor-pointer"
                >
                    {product.name}
                </h3>

                {/* Color Options */}
                {product.colors && (
                    <div className="flex justify-center gap-1 mb-3">
                        {product.colors.map((color, index) => (
                            <button
                                key={index}
                                className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && <span className="text-sm text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>}
                </div>
            </div>
        </div>
    );
};
