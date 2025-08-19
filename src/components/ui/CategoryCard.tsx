import React from "react";
import type { Category } from "../../types";
import { cn } from "../../lib/utils";

interface CategoryCardProps {
    category: Category;
    className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className }) => {
    return (
        <a
            href={category.link}
            className={cn(
                "flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300",
                className
            )}
        >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
        </a>
    );
};
