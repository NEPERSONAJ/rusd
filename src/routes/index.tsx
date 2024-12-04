import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AIChat } from '../components/chat/AIChat';

// Pages
import HomePage from '../pages/HomePage';
import CategoryPage from '../pages/CategoryPage';
import AboutPage from '../pages/AboutPage';
import SalePage from '../pages/SalePage';
import CatalogPage from '../pages/CatalogPage';
import { ContactPage } from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';

// Admin Pages
import { LoginPage } from '../pages/admin/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { ProductsPage } from '../pages/admin/ProductsPage';
import { CategoriesPage } from '../pages/admin/CategoriesPage';
import { BlogPostsPage } from '../pages/admin/BlogPostsPage';
import { AISettingsPage } from '../pages/admin/AISettingsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { MessagesPage } from '../pages/admin/MessagesPage';

export function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              <BlogPostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ai-settings"
          element={
            <ProtectedRoute>
              <AISettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

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
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                </Routes>
              </main>
              <Footer />
              <AIChat />
            </>
          }
        />
      </Routes>
    </>
  );
}
