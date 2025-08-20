import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "sale" | "new" | "hot" | "soldout" | "discount";
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "new", className }) => {
    const variants = {
        sale: "badge-sale",
        new: "badge-new",
        hot: "badge-hot",
        soldout: "badge-soldout",
        discount: "bg-red-500 text-white",
    };

    return <span className={cn("px-2 py-1 text-xs font-medium uppercase text-white rounded-sm", variants[variant], className)}>{children}</span>;
};
