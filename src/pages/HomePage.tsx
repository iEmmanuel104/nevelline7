import { HeroSection } from "../components/sections/HeroSection";
import { TrendingCategories } from "../components/sections/TrendingCategories";
import { TrendingProducts } from "../components/sections/TrendingProducts";
import { StatsSection } from "../components/sections/StatsSection";

export function HomePage() {
    return (
        <main>
            <HeroSection />
            <TrendingCategories />
            <TrendingProducts />
            <StatsSection />
        </main>
    );
}