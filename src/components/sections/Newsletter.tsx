import React from "react";
import { Send } from "lucide-react";

export const Newsletter: React.FC = () => {
    const [email, setEmail] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log("Newsletter subscription:", email);
        setEmail("");
    };

    return (
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Subscribe to Our Newsletter
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                        Get the latest updates on new products and upcoming sales
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 font-medium"
                        >
                            Subscribe <Send className="h-4 w-4" />
                        </button>
                    </form>
                    
                    <p className="text-white/70 text-sm mt-4">
                        *We respect your privacy and will never share your email
                    </p>
                </div>
            </div>
        </section>
    );
};