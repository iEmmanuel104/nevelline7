import React from 'react';
import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

const features = [
    {
        icon: <Truck className="w-8 h-8" />,
        title: "Free Shipping",
        description: "Free delivery on orders above ₦50,000",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Quality Guarantee", 
        description: "100% authentic products guaranteed",
        color: "from-green-500 to-green-600"
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: "Secure Payment",
        description: "Your payment information is safe with us",
        color: "from-purple-500 to-purple-600"
    },
    {
        icon: <Headphones className="w-8 h-8" />,
        title: "24/7 Support",
        description: "Round-the-clock customer support",
        color: "from-orange-500 to-orange-600"
    }
];

export const FeaturesSection: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group text-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};