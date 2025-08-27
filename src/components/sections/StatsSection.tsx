import React, { useState, useEffect, useRef } from 'react';
import { Users, ShoppingBag, Heart, Star } from 'lucide-react';

interface StatItem {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
}

const stats: StatItem[] = [
    {
        icon: <Users className="w-8 h-8" />,
        value: 15000,
        label: "Happy Customers",
        suffix: "+"
    },
    {
        icon: <ShoppingBag className="w-8 h-8" />,
        value: 50000,
        label: "Orders Delivered",
        suffix: "+"
    },
    {
        icon: <Heart className="w-8 h-8" />,
        value: 25000,
        label: "Products Sold",
        suffix: "+"
    },
    {
        icon: <Star className="w-8 h-8" />,
        value: 99,
        label: "Satisfaction Rate",
        suffix: "%"
    }
];

const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepValue = value / steps;
            const stepTime = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                if (currentStep <= steps) {
                    setCount(Math.floor(stepValue * currentStep));
                } else {
                    setCount(value);
                    clearInterval(timer);
                }
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-3xl font-bold">
            {count.toLocaleString()}{suffix}
        </div>
    );
};

export const StatsSection: React.FC = () => {
    return (
        <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Why Choose Nevellines?
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Join thousands of satisfied customers who trust us for their fashion needs
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full text-white mb-4 backdrop-blur-sm">
                                {stat.icon}
                            </div>
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <p className="text-gray-300 mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};