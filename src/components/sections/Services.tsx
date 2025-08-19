import React from "react";
import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const services = [
    {
        id: 1,
        icon: Truck,
        title: "FREE SHIPPING",
        description: "Enjoy free shipping on all orders above $100",
        color: "text-blue-500",
    },
    {
        id: 2,
        icon: Shield,
        title: "SECURE PAYMENTS",
        description: "We ensure secure payment with PEV system",
        color: "text-green-500",
    },
    {
        id: 3,
        icon: RefreshCw,
        title: "EASY RETURNS",
        description: "Simply return it within 30 days for an exchange",
        color: "text-orange-500",
    },
    {
        id: 4,
        icon: Headphones,
        title: "24/7 SUPPORT",
        description: "Contact us 24 hours a day, 7 days a week",
        color: "text-purple-500",
    },
];

export const Services: React.FC = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div key={service.id} className="text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4 group-hover:shadow-lg transition-shadow">
                                    <Icon className={`h-10 w-10 ${service.color}`} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};