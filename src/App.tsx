import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LogoSidePanel from './components/LogoSidePanel';
import FloatingWhatsAppQR from './components/FloatingWhatsAppQR';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import Products from './pages/Products';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FloatingElements from './components/FloatingElements';

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
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <FloatingElements />
          <LogoSidePanel />
          <Navbar 
            cartItems={cartItems}
            onUpdateCartQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setShowCheckout(true)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/products" 
              element={
                <Products 
                  onAddToCart={addToCart}
                />
              } 
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <FloatingWhatsAppQR />
          
          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            cartItems={cartItems}
            onOrderComplete={handleOrderComplete}
          />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;