import React from "react";
import { Heart, ShoppingBag, Eye, ArrowUpDown } from "lucide-react";
import type { Product } from "../../types";
import { Badge } from "./Badge";
import { cn } from "../../lib/utils";

interface ProductCardProps {
    product: Product;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const badgeVariant = product.badge?.toLowerCase().replace(" ", "") as any;

    return (
        <div
            className={cn("group relative overflow-hidden rounded-lg bg-white", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge */}
            {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                    <Badge variant={badgeVariant}>{product.badge}</Badge>
                </div>
            )}

            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge variant="discount">-{product.discount}%</Badge>
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-96 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Quick View Button */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-center transition-transform duration-300",
                        isHovered ? "translate-y-0" : "translate-y-full"
                    )}
                >
                    <button className="flex items-center justify-center gap-2 w-full">
                        <Eye className="h-4 w-4" />
                        Quick View
                    </button>
                </div>

                {/* Action Buttons */}
                <div
                    className={cn(
                        "absolute right-4 top-20 flex flex-col gap-2 transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Heart className="h-4 w-4" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <ShoppingBag className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Color Options */}
                {product.colors && (
                    <div className="flex gap-1 mb-3">
                        {product.colors.map((color, index) => (
                            <button key={index} className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                )}

                {/* Rating */}
                {product.rating !== undefined && (
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={cn("w-4 h-4", i < (product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300")}
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ))}
                        {product.reviewCount !== undefined && <span className="text-sm text-gray-500">({product.reviewCount} Reviews)</span>}
                    </div>
                )}

                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">${product.price}</span>
                    {product.originalPrice && <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>}
                </div>
            </div>
        </div>
    );
};
