import React from "react";
import { Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";

const features = [
    {
        id: 1,
        icon: Truck,
        title: "Free Shipping",
        description: "Free shipping on orders over $100",
    },
    {
        id: 2,
        icon: CreditCard,
        title: "Secure Payment",
        description: "100% secure transactions",
    },
    {
        id: 3,
        icon: RotateCcw,
        title: "30 Days Return",
        description: "30-days free return policy",
    },
    {
        id: 4,
        icon: Headphones,
        title: "24/7 Support",
        description: "We support online 24 hours",
    },
];

export const FeatureBoxes: React.FC = () => {
    return (
        <section className="py-8 border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.id} className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <Icon className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};