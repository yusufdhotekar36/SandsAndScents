import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Gift, Shield, TrendingUp, Grid3X3, Search } from 'lucide-react';
import ShopByBrandsModal from '../components/ShopByBrandsModal';
import PerfumeDetailModal from '../components/PerfumeDetailModal';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';

interface HomeProps {
  onAddToCart: (perfume: any, quantity: number) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [selectedPerfume, setSelectedPerfume] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  React.useEffect(() => {
    const fetchPerfumes = async () => {
      const { data, error } = await supabase.from('perfumes').select('*');
      if (!error) setPerfumes(data || []);
    };
    fetchPerfumes();
  }, []);

  const handlePerfumeClick = (perfume: any) => {
    setSelectedPerfume(perfume);
    setShowDetailModal(true);
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

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Premium Quality",
      description: "Handcrafted perfumes with the finest ingredients from the Arabian desert"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Authentic Scents",
      description: "Traditional Arabian fragrances passed down through generations"
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Luxury Experience",
      description: "Each bottle tells a story of desert winds and golden sunsets"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Guarantee",
      description: "100% authentic perfumes with satisfaction guarantee"
    }
  ];

  return (
    <>
      <div>
        {/* Inline Search Bar at Top */}
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search for perfumes, brands..."
              className="w-full pl-12 py-3 bg-white/90 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all text-gray-700 text-base sm:text-lg focus:outline-none"
              aria-label="Search perfumes"
            />
            <Search className="h-5 w-5 text-orange-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {/* Recommendations Dropdown */}
            {(searchFocused && searchQuery.length > 0) && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                {recommendations.length > 0 ? (
                  recommendations.map((perfume) => (
                    <button
                      key={perfume.id}
                      type="button"
                      onMouseDown={() => handlePerfumeClick(perfume)}
                      className="flex items-center w-full px-3 py-2 hover:bg-orange-50 transition-colors text-left gap-3"
                    >
                      <img src={perfume.image_url} alt={perfume.name} className="w-10 h-10 object-cover rounded" />
                      <span className="font-medium text-gray-800 line-clamp-1">{perfume.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No products were found matching your selection.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-yellow-200/30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                SANDS AND SCENTS
              </h1>
              <div className="text-orange-600 text-lg sm:text-xl mb-6">PERFUME RESELLER</div>

              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Discover the mystique of the Arabian desert through our exquisite collection
                of luxury perfumes, crafted with ancient wisdom and modern elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-base sm:text-lg font-medium"
                  >
                    Explore Collection
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-800 px-6 py-3 rounded-full text-base sm:text-lg font-medium hover:shadow-xl transition-all flex items-center space-x-2 border border-gray-200"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Top Selling</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCategoriesModal(true)}
                  aria-label="Shop by Brands Modal Trigger"
                  className="bg-white text-gray-800 px-6 py-3 rounded-full text-base sm:text-lg font-medium hover:shadow-xl transition-all flex items-center space-x-2 border border-gray-200"
                >
                  <Grid3X3 className="h-5 w-5" />
                  <span>Shop by Brands</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Floating Perfume Bottles */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-10 opacity-20 hidden sm:block"
          >
            <img
              src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Perfume"
              className="w-16 sm:w-20 h-28 sm:h-32 object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-1/3 right-10 opacity-20 hidden sm:block"
          >
            <img
              src="https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Perfume"
              className="w-14 sm:w-16 h-24 sm:h-28 object-cover rounded-lg"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Sands&Scents?
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the luxury and authenticity that sets us apart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="text-orange-500 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Begin Your Aromatic Journey
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8">
                Let the scents of the Arabian desert transport you to a world of luxury and mystique
              </p>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium hover:bg-orange-600 hover:shadow-xl transition-all"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <ShopByBrandsModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
      {/* Perfume Detail Modal for search */}
      {showDetailModal && selectedPerfume && (
        <PerfumeDetailModal
          perfume={selectedPerfume}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

export default Home;
