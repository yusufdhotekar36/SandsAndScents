import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(perfume, 1);
    toast.success(`${perfume.name} added to cart!`);
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
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {perfume.category}
          </span>
        </div>
        {perfume.stock < 10 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              Low Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {perfume.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {perfume.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">(127)</span>
          </div>
          <span className="text-xs text-gray-500">
            {perfume.stock} in stock
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{perfume.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickAdd}
            disabled={perfume.stock === 0}
            className="bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center space-x-1 hover:bg-orange-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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