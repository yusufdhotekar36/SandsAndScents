import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, Star, Heart } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

interface Perfume {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_ur2?: string;
  image_ur3?: string;
  image_ur4?: string;
  category: string;
  stock: number;
  brand: string;
}

interface PerfumeDetailModalProps {
  perfume: Perfume | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, quantity: number) => void;
}

const PerfumeDetailModal: React.FC<PerfumeDetailModalProps> = ({
  perfume,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const { showNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [mainImage, setMainImage] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (perfume) {
      setMainImage(perfume.image_url || '');
      setQuantity(1); // Reset quantity when perfume changes
      // Fetch recommendations
      fetchRecommendations();
    }
  }, [perfume]);

  const fetchRecommendations = async () => {
    if (!perfume) return;
    // Fetch 10 perfumes from the same category, excluding the current one
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .eq('category', perfume.category)
      .neq('id', perfume.id)
      .limit(10);
    if (!error && data) setRecommendations(data);
  };

  if (!isOpen || !perfume) return null;

  const sizes = ['100ml'];

  const images = [
    perfume.image_url,
    perfume.image_ur2,
    perfume.image_ur3,
    perfume.image_ur4
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    onAddToCart(perfume, quantity);
    if (quantity > 1) {
      showNotification('success', 'Added to Cart', `Added ${quantity} ${perfume.name} to cart`);
    } else {
      showNotification('success', 'Added to Cart', 'Added to cart! Proceed to checkout.');
    }
    onClose();
  };

  const handleBuyNow = () => {
    onAddToCart(perfume, quantity);
    showNotification('success', 'Added to Cart', 'Added to cart! Proceed to checkout.');
    onClose();
  };

  // Listen for openPerfumeDetail event to open a new perfume in the modal
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setQuantity(1);
        setSelectedSize('100ml');
        setMainImage(e.detail.image_url || '');
        if (typeof onAddToCart === 'function') onAddToCart(e.detail, 0);
      }
    };
    window.addEventListener('openPerfumeDetail', handler);
    return () => window.removeEventListener('openPerfumeDetail', handler);
  }, [onAddToCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Product Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={mainImage}
                    alt={perfume.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {images.map((img) => (
                    <div
                      key={img}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={perfume.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{perfume.name}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-600 text-sm">(127 reviews)</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {perfume.category}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{perfume.price}
                  <span className="text-sm sm:text-lg font-normal text-gray-500 ml-2">Free delivery</span>
                </div>

                {/* Size */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(perfume.stock, quantity + 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{perfume.stock} items available</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    disabled={perfume.stock === 0}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {perfume.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={perfume.stock === 0}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{perfume.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </motion.button>

                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Add to Wishlist</span>
                  </button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{perfume.description}</p>
                </div>

                {/* You May Also Like */}
                {recommendations.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-3">You May Also Like</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2" role="list" aria-label="Recommended perfumes">
                      {recommendations.map((rec) => (
                        <button
                          key={rec.id}
                          className="min-w-[160px] bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition-all border border-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                          onClick={() => {
                            setQuantity(1);
                            setSelectedSize('100ml');
                            setMainImage(rec.image_url || '');
                            if (typeof onClose === 'function') onClose();
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent('openPerfumeDetail', { detail: rec }));
                            }, 100);
                          }}
                          tabIndex={0}
                          aria-label={`View details for ${rec.name}`}
                        >
                          <img src={rec.image_url} alt={rec.name} className="w-full h-28 object-cover rounded mb-2" />
                          <div className="font-medium text-gray-900 truncate">{rec.name}</div>
                          <div className="text-sm text-gray-600">₹{rec.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zoom Modal */}
            <AnimatePresence>
              {isZoomOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4"
                  onClick={() => setIsZoomOpen(false)}
                >
                  <motion.img
                    src={mainImage}
                    alt="Zoomed Perfume"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="max-w-full max-h-full rounded-lg shadow-lg cursor-zoom-out"
                  />
                  <button
                    onClick={() => setIsZoomOpen(false)}
                    className="absolute top-5 right-5 text-white bg-black/50 p-2 rounded-full hover:bg-black"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PerfumeDetailModal;
