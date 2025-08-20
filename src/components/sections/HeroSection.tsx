import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
    {
        id: 1,
        subtitle: "Winter Collection",
        title: "New Winter\nCollections 2021",
        tagline: "There's nothing like trend",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop",
    },
    {
        id: 2,
        subtitle: "Summer Collection",
        title: "Amazing Summer\nSale 2021",
        tagline: "Up to 70% off on selected items",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=800&fit=crop",
    },
    {
        id: 3,
        subtitle: "Special Offer",
        title: "Fashion Week\nExclusive",
        tagline: "Designer collections at best prices",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop",
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
                            className="relative min-h-[700px] bg-cover bg-center flex items-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="absolute inset-0 bg-black/30"></div>
                            <div className="container mx-auto px-4 relative z-10">
                                <div className="max-w-2xl">
                                    <p className="text-red-500 uppercase tracking-widest mb-4 font-medium text-sm">{slide.subtitle}</p>
                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 whitespace-pre-line leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-white/90 mb-8 text-xl">{slide.tagline}</p>
                                    <button className="btn-primary bg-white text-black hover:bg-black hover:text-white inline-flex items-center gap-2">
                                        Shop Now <ArrowRight className="h-4 w-4" />
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
