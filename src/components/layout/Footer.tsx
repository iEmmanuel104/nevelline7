import React from "react";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "../ui/Logo";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About */}
                    <div>
                        <div className="mb-6">
                            <Logo size="md" variant="light" />
                        </div>
                        <p className="mb-6 text-sm leading-relaxed">
                            Your ultimate fashion destination. Discover the latest trends and timeless pieces 
                            that define your unique style.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span>Lagos, Nigeria</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-red-500" />
                                <span>+234 800 000 0000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-red-500" />
                                <span>hello@nevellines.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white text-lg">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Men's Collection
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Women's Collection
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Kid's Collection
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Accessories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white text-lg">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Customer Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Order Tracking
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Shipping & Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">
                                    Size Guide
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-6 text-white text-lg">Newsletter</h4>
                        <p className="mb-4 text-sm">Subscribe to get special offers, free giveaways, and updates on new arrivals.</p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-sm transition-colors font-medium">
                                Subscribe
                            </button>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm">© 2024 Nevellines. All rights reserved. Your Style Destination.</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">We Accept:</span>
                            <div className="flex space-x-2">
                                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8" />
                                <img src="https://img.icons8.com/color/48/000000/stripe.png" alt="Stripe" className="h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
