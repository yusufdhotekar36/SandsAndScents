import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  Search,
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileBottomNavProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  onLoginClick: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartItemCount,
  onCartClick,
  onSearchClick,
  onLoginClick
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      onClick: () => setActiveTab('home')
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: ShoppingBag,
      path: '/products',
      onClick: () => setActiveTab('shop')
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      onClick: () => {
        setActiveTab('search');
        onSearchClick();
      }
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      onClick: () => setActiveTab('wishlist')
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      onClick: () => {
        setActiveTab('cart');
        onCartClick();
      }
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      onClick: () => {
        setActiveTab('account');
        if (!user) {
          onLoginClick();
        }
      }
    }
  ];

  // Update active tab based on current route
  React.useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('home');
    } else if (location.pathname === '/products') {
      setActiveTab('shop');
    }
  }, [location.pathname]);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCart = item.id === 'cart';
          const isAccount = item.id === 'account';

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center flex-1 py-2"
            >
              {item.path ? (
                <Link
                  to={item.path}
                  onClick={item.onClick}
                  className={`flex flex-col items-center justify-center w-full ${
                    isActive ? 'btn-primary text-white' : 'text-gray-600'
                  } transition-colors`}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-600'}`} />
                    {isCart && cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className={`flex flex-col items-center justify-center w-full ${
                    isActive ? 'btn-primary text-white' : 'text-gray-600'
                  } transition-colors`}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-600'}`} />
                    {isCart && cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                    {isAccount && user && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav; 