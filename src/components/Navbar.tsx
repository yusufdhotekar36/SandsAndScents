import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Grid3X3,
  User,
  LogOut,
  ChevronDown,
  Search,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CartModal from './CartModal';
import ShopByBrandsModal from './ShopByBrandsModal';
import UserAuthModal from './UserAuthModal';
import SearchModal from './SearchModal';
import { useNotification } from '../contexts/NotificationContext';

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
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onCheckout,
  onLoginClick,
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { showNotification } = useNotification();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBrandsModal, setShowBrandsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('success', 'Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('error', 'Logout Failed', 'Error logging out. Please try again.');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpeg" alt="Sands & Scents Logo" className="h-8 w-8 rounded-full object-cover border-none" />
              <span className="text-2xl font-bold text-gray-900">Sands&Scents</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Perfumes</Link>
              <button
                onClick={() => setShowBrandsModal(true)}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Shop by Brands</span>
              </button>
              <Link to="/privacy-policy" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Privacy Policy</Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* User Authentication */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/data-deletion-policy"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Data Deletion Policy
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Login / Signup</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => setShowCartModal(true)}
                className="relative text-gray-700 hover:text-orange-600 transition-colors hidden md:block"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Search */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="text-gray-700 hover:text-orange-600 transition-colors hidden md:block"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Hamburger */}
              <button
                className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-4 mt-4 pb-4 border-t border-gray-200">
              <Link to="/" className="block text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link to="/products" className="block text-gray-700 hover:text-orange-600 font-medium transition-colors">Perfumes</Link>
              <button
                onClick={() => {
                  setShowBrandsModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Shop by Brands
              </button>
              <Link to="/privacy-policy" className="block text-gray-700 hover:text-orange-600 font-medium transition-colors">Privacy Policy</Link>

              {/* Mobile Authentication */}
              {user ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/data-deletion-policy"
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    Data Deletion Policy
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Login / Signup
                </button>
              )}
            </div>
          )}
        </div>
      </motion.nav>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveFromCart}
        onCheckout={onCheckout}
      />

      {/* Shop by Brands Modal */}
      <ShopByBrandsModal
        isOpen={showBrandsModal}
        onClose={() => setShowBrandsModal(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      {/* User Auth Modal */}
      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default Navbar;
