import React from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../types";
import { cn } from "../../lib/utils";

interface CategoryCardProps {
    category: Category;
    className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className }) => {
    return (
        <Link
            to={category.link || `/collections/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn("category-card group flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2", className)}
        >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="text-2xl">{category.icon}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-center group-hover:text-black transition-colors">
                {category.name}
            </h3>
        </Link>
    );
};
