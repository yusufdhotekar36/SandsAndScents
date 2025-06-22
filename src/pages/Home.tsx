import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Gift, Shield, TrendingUp, Grid3X3 } from 'lucide-react';
import CategoriesModal from '../components/CategoriesModal';

const Home = () => {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

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
      <div className="pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-yellow-200/30" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-4xl font-calibri text-gray-900 mb-6">
                SANDS AND SCENTS
                 <h2> <span className="text-2xl block text-orange-600">PERFUME RESELLER</span>
              </h2>
              </h1>
             
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Discover the mystique of the Arabian desert through our exquisite collection 
                of luxury perfumes, crafted with ancient wisdom and modern elegance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 hover:shadow-xl transition-all duration-300"
                  >
                    Explore Collection
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-200"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Top Selling</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCategoriesModal(true)}
                  className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-gray-200"
                >
                  <Grid3X3 className="h-5 w-5" />
                  <span>Categories</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Floating perfume bottles */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-10 opacity-20"
          >
            <img
              src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Perfume"
              className="w-20 h-32 object-cover rounded-lg"
            />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-1/3 right-10 opacity-20"
          >
            <img
              src="https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Perfume"
              className="w-16 h-28 object-cover rounded-lg"
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Sand&Scents?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the luxury and authenticity that sets us apart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="text-orange-500 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-12 rounded-3xl shadow-lg"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Begin Your Aromatic Journey
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Let the scents of the Arabian desert transport you to a world of luxury and mystique
              </p>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-orange-600 hover:shadow-xl transition-all duration-300"
                >
                  Shop Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </>
  );
};

export default Home;