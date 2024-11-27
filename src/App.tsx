import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/utils/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AIChat } from './components/chat/AIChat';
import { MetaSettings } from './components/MetaSettings';
import { SecurityHeaders } from './components/SecurityHeaders';
import { YandexMetrika } from './components/analytics/YandexMetrika';
import { GoogleAnalytics } from './components/analytics/GoogleAnalytics';
import { CustomScripts } from './components/CustomScripts';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import SalePage from './pages/SalePage';
import CatalogPage from './pages/CatalogPage';
import NotFoundPage from './pages/NotFoundPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { MessagesPage } from './pages/admin/MessagesPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { AISettingsPage } from './pages/admin/AISettingsPage';
import { CartProvider } from './context/CartContext';
import { AIChatProvider } from './context/AIChatContext';
import { AppRoutes } from './routes';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { BlogPostsPage } from './pages/admin/BlogPostsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AnalyticsSettingsPage } from './pages/admin/AnalyticsSettingsPage';
import { analyticsService } from './lib/services/analyticsService';
import CalculatorsPage from './pages/CalculatorsPage';
import WallpaperCalculator from './pages/calculators/WallpaperCalculator';
import MoldingCalculator from './pages/calculators/MoldingCalculator';
import PlinthCalculator from './pages/calculators/PlinthCalculator';
import MarbleCalculator from './pages/calculators/MarbleCalculator';
import CornersCalculator from './pages/calculators/CornersCalculator';
import PanelsCalculator from './pages/calculators/PanelsCalculator';
import FilmCalculator from './pages/calculators/FilmCalculator';
import GlueCalculator from './pages/calculators/GlueCalculator';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Analytics tracker component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    analyticsService.trackVisit(location.pathname);
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AIChatProvider>
          <Router>
            <SecurityHeaders />
            <MetaSettings />
            <YandexMetrika />
            <GoogleAnalytics />
            <CustomScripts />
            <ScrollToTop />
            <AnalyticsTracker />
            <Toaster position="top-right" />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/ai-settings" element={<AISettingsPage />} />
              <Route path="/admin/analytics" element={<AnalyticsSettingsPage />} />
              <Route path="/admin/blog" element={<BlogPostsPage />} />
              <Route path="/admin/messages" element={<MessagesPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryId" element={<CategoryPage />} />
                        <Route path="/sale" element={<SalePage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogPostPage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/calculators" element={<CalculatorsPage />} />
                        <Route path="/calculators/wallpaper" element={<WallpaperCalculator />} />
                        <Route path="/calculators/molding" element={<MoldingCalculator />} />
                        <Route path="/calculators/plinth" element={<PlinthCalculator />} />
                        <Route path="/calculators/marble" element={<MarbleCalculator />} />
                        <Route path="/calculators/corners" element={<CornersCalculator />} />
                        <Route path="/calculators/panels" element={<PanelsCalculator />} />
                        <Route path="/calculators/film" element={<FilmCalculator />} />
                        <Route path="/calculators/glue" element={<GlueCalculator />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                    <AIChat />
                  </>
                }
              />
            </Routes>
          </Router>
        </AIChatProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
