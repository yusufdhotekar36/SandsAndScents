// src/routes.tsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletionPolicy from './pages/DataDeletionPolicy';

import MainLayout from './MainLayout';
import ErrorPage from './components/ErrorPage.tsx';

// Define your cart-related prop types
interface RouterProps {
  cartItems: any[];
  onUpdateCartQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  onAddToCart: (item: any, quantity: number) => void;
  onLoginClick: () => void;
}

// Export as a function that returns the router
export const router = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCheckout,
  onAddToCart,
  onLoginClick
}: RouterProps) =>
  createBrowserRouter([
    {
      element: (
        <MainLayout
          cartItems={cartItems}
          onUpdateCartQuantity={onUpdateCartQuantity}
          onRemoveFromCart={onRemoveFromCart}
          onCheckout={onCheckout}
          onLoginClick={onLoginClick}
        />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home onAddToCart={onAddToCart} />
        },
        {
          path: '/products',
          element: <Products onAddToCart={onAddToCart} />
        },
        {
          path: '/privacy-policy',
          element: <PrivacyPolicy />
        },
        {
          path: '/data-deletion-policy',
          element: <DataDeletionPolicy />
        }
      ]
    },
    {
      path: '/admin/login',
      element: <AdminLogin />,
      errorElement: <ErrorPage />
    },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />,
      errorElement: <ErrorPage />
    }
  ]);
