import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Kumo</h3>
                        <p className="text-gray-400 mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-gray-300">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-300">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-gray-300">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <h4 className="font-semibold mb-4 uppercase">Customer</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    My Account
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Order History
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Wish List
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Newsletter
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold mb-4 uppercase">Shop</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Accessories
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Men
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Women
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe */}
                    <div>
                        <h4 className="font-semibold mb-4 uppercase">Subscribe</h4>
                        <p className="text-gray-400 mb-4">Get updates about new products and upcoming sales</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l focus:outline-none focus:bg-gray-700"
                            />
                            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r transition-colors">Subscribe</button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-wrap items-center justify-between">
                    <p className="text-gray-400">© 2024 Kumo. Designed by ThemezHub.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <img src="/api/placeholder/40/25" alt="Payment" className="h-6" />
                        <img src="/api/placeholder/40/25" alt="Payment" className="h-6" />
                        <img src="/api/placeholder/40/25" alt="Payment" className="h-6" />
                        <img src="/api/placeholder/40/25" alt="Payment" className="h-6" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
