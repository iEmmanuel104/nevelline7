import React from "react";
import { CategoryCard } from "../ui/CategoryCard";
import { categories } from "../../data/mockData";

export const TrendingCategories: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Categories</h2>
                    <p className="text-gray-600">Discover our most popular product categories</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
};
