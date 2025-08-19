import React from "react";
import Countdown from "react-countdown";
import { ArrowRight } from "lucide-react";

interface CountdownRendererProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }: CountdownRendererProps) => {
    if (completed) {
        return <span>Deal Expired!</span>;
    } else {
        return (
            <div className="flex gap-4">
                <div className="text-center">
                    <div className="bg-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold text-gray-900">{days.toString().padStart(2, "0")}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">DAYS</span>
                </div>
                <div className="text-center">
                    <div className="bg-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold text-gray-900">{hours.toString().padStart(2, "0")}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">HOURS</span>
                </div>
                <div className="text-center">
                    <div className="bg-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold text-gray-900">{minutes.toString().padStart(2, "0")}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">MINS</span>
                </div>
                <div className="text-center">
                    <div className="bg-white rounded-lg p-3 min-w-[60px]">
                        <span className="text-2xl font-bold text-gray-900">{seconds.toString().padStart(2, "0")}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1">SECS</span>
                </div>
            </div>
        );
    }
};

export const DealOfTheDay: React.FC = () => {
    const dealEndDate = new Date();
    dealEndDate.setDate(dealEndDate.getDate() + 3); // Deal ends in 3 days

    return (
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-white">
                        <p className="text-red-500 uppercase tracking-wider mb-4 font-medium">Limited Time Offer</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Deal Of The Day</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Get up to 50% off on selected items. Limited time offer, hurry up!
                        </p>
                        
                        {/* Countdown Timer */}
                        <div className="mb-8">
                            <Countdown date={dealEndDate} renderer={CountdownRenderer} />
                        </div>

                        <button className="bg-white text-black px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-medium">
                            Shop Now <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop"
                                alt="Deal Product"
                                className="rounded-lg w-full"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                                -50%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};