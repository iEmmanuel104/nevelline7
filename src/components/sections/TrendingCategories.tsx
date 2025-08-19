import React from "react";
import { CategoryCard } from "../ui/CategoryCard";
import { SectionHeader } from "../common/SectionHeader";
import { categories } from "../../data/mockData";

export const TrendingCategories: React.FC = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionHeader subtitle="Popular" title="Trending Categories" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
};
