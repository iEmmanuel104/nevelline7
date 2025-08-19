import React from "react";
import { updates } from "../../data/mockData";

export const NewUpdates: React.FC = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold text-center mb-12">New Updates</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {updates.map((update) => (
                        <div key={update.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <img src={update.image} alt={update.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2">{update.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{update.description}</p>
                                <a href={update.link} className="text-blue-600 hover:underline text-sm">
                                    Continue Reading →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instagram Section */}
                <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">@kumo_21</h3>
                    <p className="text-gray-600 mb-8">From Instagram</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative group overflow-hidden rounded-lg">
                                <img
                                    src={`/api/placeholder/300/300`}
                                    alt={`Instagram ${i}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                                    <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Add Instagram icon since it's used in NewUpdates
const Instagram: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
    </svg>
);
