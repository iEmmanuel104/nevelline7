// src/App.tsx
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { FeatureBoxes } from "./components/sections/FeatureBoxes";
import { TrendingCategories } from "./components/sections/TrendingCategories";
import { DealOfTheDay } from "./components/sections/DealOfTheDay";
import { TrendingProducts } from "./components/sections/TrendingProducts";
import { Services } from "./components/sections/Services";
import { Newsletter } from "./components/sections/Newsletter";
import { NewUpdates } from "./components/sections/NewUpdates";

function App() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Navigation />
            <main>
                <HeroSection />
                <FeatureBoxes />
                <TrendingCategories />
                <TrendingProducts />
                <DealOfTheDay />
                <NewUpdates />
                <Services />
                <Newsletter />
            </main>
            <Footer />
        </div>
    );
}

export default App;