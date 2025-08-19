import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/swiper-bundle.css";

const slides = [
    {
        id: 1,
        subtitle: "Winter Collection",
        title: "New Winter\nCollections 2021",
        tagline: "There's nothing like trend",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=700&fit=crop",
    },
    {
        id: 2,
        subtitle: "Summer Collection",
        title: "Amazing Summer\nSale 2021",
        tagline: "Up to 70% off on selected items",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=700&fit=crop",
    },
    {
        id: 3,
        subtitle: "Special Offer",
        title: "Fashion Week\nExclusive",
        tagline: "Designer collections at best prices",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=700&fit=crop",
    },
];

export const HeroSection: React.FC = () => {
    return (
        <section className="relative hero-section">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="hero-slider"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="relative min-h-[600px] bg-cover bg-center flex items-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="container mx-auto px-4 relative z-10">
                                <div className="max-w-2xl">
                                    <p className="text-red-500 uppercase tracking-wider mb-4 font-medium">
                                        {slide.subtitle}
                                    </p>
                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 whitespace-pre-line">
                                        {slide.title}
                                    </h1>
                                    <p className="text-white/90 mb-8 text-xl italic">{slide.tagline}</p>
                                    <button className="bg-white text-black px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-medium">
                                        Shop Now <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};