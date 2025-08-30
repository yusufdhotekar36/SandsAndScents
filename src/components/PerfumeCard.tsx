import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface PerfumeCardProps {
  perfume: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
  };
  onClick: () => void;
  onAddToCart: (perfume: any, quantity: number) => void;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, onClick, onAddToCart }) => {
  const { showNotification } = useNotification();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(perfume, 1);
    showNotification('success', 'Added to Cart', `${perfume.name} has been added to your cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={perfume.image_url}
          alt={perfume.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
            {perfume.category}
          </span>
        </div>

        {/* Low Stock badge */}
        {perfume.stock < 10 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              Low Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
          {perfume.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {perfume.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{perfume.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickAdd}
            disabled={perfume.stock === 0}
            className="btn-primary flex items-center space-x-1 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{perfume.stock === 0 ? 'Out of Stock' : 'Add'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PerfumeCard;
