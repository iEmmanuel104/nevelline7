import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";
import { HomePage } from "./pages/HomePage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="min-h-screen bg-white">
                    <Header />
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/collections" element={<CollectionsPage />} />
                        <Route path="/collections/:category" element={<CollectionsPage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
