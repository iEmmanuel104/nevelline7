import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "../ui/CategoryCard";
import api from "../../lib/api";

const CategoriesContent: React.FC = () => {
    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data.categories;
        }
    });

    if (isLoading) {
        return Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse text-center">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
            </div>
        ));
    }

    return (
        <>
            {categoriesData?.map((category: any) => (
                <CategoryCard 
                    key={category._id} 
                    category={{
                        id: category._id,
                        name: category.name,
                        slug: category.slug,
                        image: category.image,
                        icon: category.icon,
                        link: `/collections/${category.slug}`
                    }} 
                />
            ))}
        </>
    );
};

export const TrendingCategories: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Categories</h2>
                    <p className="text-gray-600">Discover our most popular product categories</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    <CategoriesContent />
                </div>
            </div>
        </section>
    );
};
