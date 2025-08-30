// src/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import SearchModal from './components/SearchModal';
import CartModal from './components/CartModal';
import ScrollToTop from './components/ScrollToTop';
import { supabase } from './lib/supabase';
import PerfumeDetailModal from './components/PerfumeDetailModal';

// Define the CartItem interface for type safety
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string;
  // Add more fields if needed (e.g. brand)
}

interface MainLayoutProps {
  cartItems: CartItem[];
  onUpdateCartQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  onLoginClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCheckout,
  onLoginClick
}) => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [perfumes, setPerfumes] = useState([]);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchPerfumes = async () => {
      const { data, error } = await supabase.from('perfumes').select('*');
      if (!error) setPerfumes(data || []);
    };
    fetchPerfumes();
  }, []);

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handlePerfumeClick = (perfume) => {
    setSelectedPerfume(perfume);
    setShowDetailModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar
        cartItems={cartItems}
        onUpdateCartQuantity={onUpdateCartQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onCheckout={onCheckout}
        onLoginClick={onLoginClick}
      />
      
      {/* Main content with proper spacing for mobile bottom nav */}
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
        onSearchClick={handleSearchClick}
        onLoginClick={onLoginClick}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveFromCart}
        onCheckout={() => {
          setShowCartModal(false);
          onCheckout();
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        perfumes={perfumes}
        onPerfumeClick={handlePerfumeClick}
      />

      {/* Perfume Detail Modal for search */}
      {showDetailModal && selectedPerfume && (
        <PerfumeDetailModal
          perfume={selectedPerfume}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onAddToCart={onUpdateCartQuantity}
        />
      )}
    </div>
  );
};

export default MainLayout;
