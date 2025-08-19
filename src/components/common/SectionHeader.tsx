import React from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className }) => {
    return (
        <div className={cn("text-center mb-12", className)}>
            {subtitle && <p className="text-gray-400 text-5xl font-light mb-4 italic">{subtitle}</p>}
            <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
        </div>
    );
};
