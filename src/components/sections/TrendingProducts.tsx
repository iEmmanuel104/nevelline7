import React from "react";
import { ProductCard } from "../ui/ProductCard";
import { SectionHeader } from "../common/SectionHeader";
import { trendingProducts, featuredProducts, mensProducts, womensProducts, kidsProducts } from "../../data/mockData";
import type { Product } from "../../types";

export const TrendingProducts: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState("all");

    const tabs = [
        { id: "all", label: "ALL" },
        { id: "mens", label: "MEN'S" },
        { id: "womens", label: "WOMEN" },
        { id: "kids", label: "KIDS" },
    ];

    const getProductsByTab = (): Product[] => {
        switch (activeTab) {
            case "mens":
                return mensProducts;
            case "womens":
                return womensProducts;
            case "kids":
                return kidsProducts;
            default:
                return [...trendingProducts, ...featuredProducts];
        }
    };

    const displayProducts = getProductsByTab();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <SectionHeader subtitle="Trending Products" title="Our Trending Products" />

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-2 font-medium transition-colors ${
                                    activeTab === tab.id ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Explore More Button */}
                <div className="text-center mt-12">
                    <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
                        Explore More →
                    </button>
                </div>
            </div>
        </section>
    );
};