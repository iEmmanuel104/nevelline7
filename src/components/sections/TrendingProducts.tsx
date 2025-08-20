import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../ui/ProductCard";
import { ProductQuickView } from "../ui/ProductQuickView";
import { trendingProducts, mensProducts, womensProducts, kidsProducts } from "../../data/mockData";
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

    const getProductsByTab = (): Product[] => {
        switch (activeTab) {
            case "womens":
                return womensProducts;
            case "kids":
                return kidsProducts;
            default:
                return [...trendingProducts, ...mensProducts].slice(0, 8);
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
                    {displayProducts.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onQuickView={handleQuickView}
                        />
                    ))}
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
