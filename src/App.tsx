import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { router } from './routes';
import UserAuthModal from './components/UserAuthModal';
import CheckoutModal from './components/CheckoutModal';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // ✅ State for Login/Signup modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');

  const addToCart = (perfume: any, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === perfume.id);
    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems(items => [
        ...items,
        {
          id: perfume.id,
          name: perfume.name,
          price: perfume.price,
          image_url: perfume.image_url,
          quantity
        }
      ]);
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <AuthProvider>
      <NotificationProvider>
      <RouterProvider
        router={router({
          cartItems,
          onUpdateCartQuantity: updateCartQuantity,
          onRemoveFromCart: removeFromCart,
          onCheckout: handleCheckout,
          onAddToCart: addToCart,
          // ✅ This triggers the modal from Navbar
          onLoginClick: () => {
            setAuthMode('login');
            setAuthModalOpen(true);
          },
        })}
      />

      {/* ✅ Login / Signup Modal */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          onOrderComplete={handleOrderComplete}
        />
      )}
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
