import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Logo } from "../ui/Logo";

export const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const { getItemCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/">
                                <Logo size="md" variant="dark" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                                Home
                            </Link>
                            <Link to="/collections" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                                Collections
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-5">
                            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-700 hover:text-red-500 transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="text-gray-700 hover:text-red-500 transition-colors relative"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {getItemCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {getItemCount()}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden text-gray-700 hover:text-red-500 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div className="border-t border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-red-500"
                                />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col space-y-4">
                                <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                                    Home
                                </Link>
                                <Link to="/collections" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                                    Collections
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};
