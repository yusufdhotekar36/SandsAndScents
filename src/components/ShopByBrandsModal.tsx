import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Crown, Leaf, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShopByBrandsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopByBrandsModal: React.FC<ShopByBrandsModalProps> = ({ isOpen, onClose }) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const navigate = useNavigate(); // ✅ useNavigate hook

  const handleBrandClick = (brandName: string) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
    onClose(); // ✅ close modal after navigating
  };

  const genderCategories = [
    {
      id: 'men',
      title: 'Men',
      icon: <User className="h-8 w-8" />,
      gradient: 'from-slate-600 to-slate-800',
      brands: [
        'Tom Ford', 'Creed', 'Dior Sauvage', 'Bleu de Chanel', 'Versace Eros',
        'Armani Code', 'Hugo Boss', 'Paco Rabanne', 'Yves Saint Laurent', 'Dolce & Gabbana'
      ]
    },
    {
      id: 'women',
      title: 'Women',
      icon: <Crown className="h-8 w-8" />,
      gradient: 'from-slate-600 to-slate-800',
      brands: [
        'Chanel No. 5', 'Miss Dior', 'Lancôme', 'Gucci Bloom', 'Viktor & Rolf',
        'Marc Jacobs', 'Prada', 'Versace Bright Crystal', 'Yves Saint Laurent', 'Givenchy'
      ]
    },
    {
      id: 'unisex',
      title: 'Unisex',
      icon: <Leaf className="h-8 w-8" />,
      gradient: 'from-slate-600 to-slate-800',
      brands: [
        'Le Labo', 'Byredo', 'Maison Margiela', 'Diptyque', 'Aesop',
        'Hermès', 'Kilian', 'Amouage', 'Creed Aventus', 'Tom Ford Oud Wood'
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800">Shop by Brands</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Category View */}
            {!selectedGender ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {genderCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGender(category.id)}
                    className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${category.gradient} text-white text-center hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex justify-center mb-4">
                      {category.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-white/80 text-sm sm:text-base">
                      Explore {category.title.toLowerCase()} fragrances
                    </p>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div>
                {/* Back & Header */}
                <div className="flex items-center flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setSelectedGender(null)}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    ← Back
                  </button>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {genderCategories.find(c => c.id === selectedGender)?.title} Brands
                  </h3>
                </div>

                {/* Brand List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {genderCategories
                    .find(c => c.id === selectedGender)
                    ?.brands.map((brand, index) => (
                      <motion.button
                        key={brand}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBrandClick(brand)} // ✅ trigger navigation
                        className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-center border border-gray-200"
                      >
                        <span className="text-sm sm:text-base font-medium text-gray-800">{brand}</span>
                      </motion.button>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShopByBrandsModal;
