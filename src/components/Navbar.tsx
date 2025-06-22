import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, Settings } from 'lucide-react';
import CartModal from './CartModal';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface NavbarProps {
  cartItems: CartItem[];
  onUpdateCartQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItems, 
  onUpdateCartQuantity, 
  onRemoveFromCart, 
  onCheckout 
}) => {
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);

  const handleAdminAccess = () => {
    const adminCode = prompt('Enter admin access code:');
    if (adminCode === 'ADMIN2024') {
      navigate('/admin/login');
    } else {
      toast.error('Invalid access code');
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                Sands&Scents
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Perfumes
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCartModal(true)}
                className="relative text-gray-700 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={handleAdminAccess}
                className="text-gray-700 hover:text-orange-600 transition-colors"
                title="Admin Access"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

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
    </>
  );
};

export default Navbar;