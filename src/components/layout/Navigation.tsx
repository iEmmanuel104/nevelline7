import React from "react";
import { ShoppingBag, User, Search, Menu } from "lucide-react";

export const Navigation: React.FC = () => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="text-2xl font-bold text-gray-900">
                            Kumo
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                            Home
                        </a>
                        <a href="/shop" className="text-gray-700 hover:text-gray-900 transition-colors">
                            Shop
                        </a>
                        <a href="/product" className="text-gray-700 hover:text-gray-900 transition-colors">
                            Product
                        </a>
                        <a href="/pages" className="text-gray-700 hover:text-gray-900 transition-colors">
                            Pages
                        </a>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </button>
                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
