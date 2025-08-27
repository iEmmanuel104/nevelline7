import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Footer } from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { HomePage } from "./pages/HomePage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/LoginPage";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import AdminCategoriesPage from "./pages/admin/CategoriesPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import AdminProductDetailPage from "./pages/admin/ProductDetailPage";
import AdminPaymentLinksPage from "./pages/admin/PaymentLinksPage";
import AdminCustomersPage from "./pages/admin/CustomersPage";
import CloudinaryTest from "./pages/admin/CloudinaryTest";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

function AppContent() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-white">
            {!isAdminRoute && (
                <>
                    {/* <Header /> */}
                    <Navigation />
                </>
            )}
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:category" element={<CollectionsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="products/:id" element={<AdminProductDetailPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="payment-links" element={<AdminPaymentLinksPage />} />
                    <Route path="customers" element={<AdminCustomersPage />} />
                    <Route path="settings" element={<div className="p-6">Settings Page (Coming Soon)</div>} />
                    <Route path="cloudinary-test" element={<CloudinaryTest />} />
                </Route>
            </Routes>
            {!isAdminRoute && <Footer />}
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <CartProvider>
                <Router>
                    <AdminProvider>
                        <AppContent />
                    </AdminProvider>
                </Router>
            </CartProvider>
        </QueryClientProvider>
    );
}

export default App;
