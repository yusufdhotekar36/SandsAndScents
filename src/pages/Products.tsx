import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PerfumeCard from '../components/PerfumeCard';
import PerfumeDetailModal from '../components/PerfumeDetailModal';
import toast from 'react-hot-toast';

interface Perfume {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductsProps {
  onAddToCart: (perfume: Perfume, quantity: number) => void;
}

const Products: React.FC<ProductsProps> = ({ onAddToCart }) => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const categories = ['All', 'Oud', 'Rose', 'Musk', 'Amber', 'Sandalwood'];

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (error) {
      toast.error('Error fetching perfumes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePerfumeClick = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setShowDetailModal(true);
  };

  const filteredPerfumes = perfumes.filter(perfume => {
    const matchesSearch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perfume.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || perfume.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading perfumes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our exquisite range of Arabian perfumes, each bottle containing 
              the essence of desert winds and ancient traditions.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl mb-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-500 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          {filteredPerfumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white p-12 rounded-2xl max-w-md mx-auto shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No perfumes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPerfumes.map((perfume, index) => (
                <motion.div
                  key={perfume.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PerfumeCard 
                    perfume={perfume} 
                    onClick={() => handlePerfumeClick(perfume)}
                    onAddToCart={onAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PerfumeDetailModal
        perfume={selectedPerfume!}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
};

export default Products;