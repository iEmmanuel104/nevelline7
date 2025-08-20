import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export const Header: React.FC = () => {
    return (
        <div className="bg-gray-50 py-2 text-xs border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            Get Pre-delivery from £100
                        </span>
                        <span className="hidden md:flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            +1234 567 890
                        </span>
                        <span className="hidden md:flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            support@kumo.com
                        </span>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600">
                        <a href="/account" className="hover:text-gray-900 transition-colors">
                            My Account
                        </a>
                        <a href="/wishlist" className="hover:text-gray-900 transition-colors">
                            Wishlist
                        </a>
                        <a href="/signup" className="hover:text-gray-900 transition-colors">
                            Sign In
                        </a>
                        <select className="bg-transparent text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                            <option>EN</option>
                            <option>ES</option>
                            <option>FR</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
