import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../ui/ProductCard";
import { ProductQuickView } from "../ui/ProductQuickView";
import api from "../../lib/api";
import type { Product } from "../../types";
import { cn } from "../../lib/utils";

export const TrendingProducts: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState("all");
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

    const tabs = [
        { id: "all", label: "MEN'S" },
        { id: "womens", label: "WOMEN" },
        { id: "kids", label: "KIDS" },
    ];

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/products?limit=20');
            return response.data.products;
        }
    });

    const getProductsByTab = (): Product[] => {
        if (!productsData) return [];
        
        switch (activeTab) {
            case "womens":
                return productsData.filter((product: Product) => 
                    product.category === "womens-wear"
                ).slice(0, 8);
            case "kids":
                return productsData.filter((product: Product) => 
                    product.category === "kids-wear"
                ).slice(0, 8);
            default:
                return productsData.filter((product: Product) => 
                    product.category === "mens-wear" || product.featured
                ).slice(0, 8);
        }
    };

    const displayProducts = getProductsByTab();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="text-sm text-gray-500 mb-2">Featured</p>
                    <h2 className="text-4xl font-bold text-gray-900">Trending Products</h2>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-gray-100 rounded-sm p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-8 py-2 font-medium transition-all rounded-sm",
                                    activeTab === tab.id ? "bg-red-500 text-white" : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                            </div>
                        ))
                    ) : (
                        displayProducts.map((product) => (
                            <ProductCard 
                                key={product._id || product.id} 
                                product={product} 
                                onQuickView={handleQuickView}
                            />
                        ))
                    )}
                </div>

                {/* Explore More Button */}
                <div className="text-center mt-16">
                    <button 
                        onClick={() => navigate('/collections')}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                    >
                        Explore More
                    </button>
                </div>

                {/* Quick View Modal */}
                <ProductQuickView
                    product={quickViewProduct}
                    isOpen={isQuickViewOpen}
                    onClose={closeQuickView}
                />
            </div>
        </section>
    );
};
