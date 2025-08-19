import React from "react";
import { MapPin } from "lucide-react";

export const Header: React.FC = () => {
    return (
        <div className="bg-gray-100 py-2 text-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Get Pre-delivery from £100
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="/account" className="hover:underline">
                            My Account
                        </a>
                        <a href="/wishlist" className="hover:underline">
                            Wishlist
                        </a>
                        <a href="/signup" className="hover:underline">
                            Sign up
                        </a>
                        <select className="bg-transparent">
                            <option>ENG</option>
                            <option>ESP</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
