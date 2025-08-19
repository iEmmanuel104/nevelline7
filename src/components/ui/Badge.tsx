import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "sale" | "new" | "hot" | "soldOut" | "discount";
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "new", className }) => {
    const variants = {
        sale: "bg-green-500 text-white",
        new: "bg-green-500 text-white",
        hot: "bg-orange-500 text-white",
        soldOut: "bg-gray-800 text-white",
        discount: "bg-red-500 text-white",
    };

    return <span className={cn("px-3 py-1 text-xs font-semibold uppercase rounded", variants[variant], className)}>{children}</span>;
};
