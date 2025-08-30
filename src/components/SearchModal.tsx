import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter } from 'lucide-react';
import Fuse from 'fuse.js';

interface Perfume {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  brand?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onPerfumeClick: (perfume: Perfume) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, perfumes, onPerfumeClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'unisex', name: 'Unisex' },
    { id: 'miniature', name: 'Miniature' },
    { id: 'body-bath', name: 'Body & Bath' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    onClose();
  };

  // Fuzzy search setup
  const fuse = new Fuse(perfumes, {
    keys: ['name', 'brand', 'description'],
    threshold: 0.4, // Adjust for strictness (lower = stricter)
  });

  // Fuzzy recommendations
  const recommendations = searchQuery.length > 0
    ? fuse.search(searchQuery).slice(0, 5).map(result => result.item)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Search Products</h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Form */}
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for perfumes, brands..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all"
                    autoFocus
                  />
                  {/* Recommendations Dropdown */}
                  {recommendations.length > 0 ? (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                      {recommendations.map((perfume) => (
                        <button
                          key={perfume.id}
                          type="button"
                          onClick={() => onPerfumeClick(perfume)}
                          className="flex items-center w-full px-3 py-2 hover:bg-orange-50 transition-colors text-left gap-3"
                        >
                          <img src={perfume.image_url} alt={perfume.name} className="w-10 h-10 object-cover rounded" />
                          <span className="font-medium text-gray-800 line-clamp-1">{perfume.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 text-center text-gray-500 text-sm">
                      No products were found matching your selection.
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full font-medium shadow-lg"
                >
                  Search Products
                </motion.button>
              </form>

              {/* Quick Search Suggestions */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Lattafa', 'Armaf', 'Ajmal', 'Rasasi', 'Oud', 'Vanilla', 'Rose'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal; 