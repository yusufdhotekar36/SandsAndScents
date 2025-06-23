import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';

const LogoSidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Logo Button */}
      <motion.div
        className="fixed top-4 left-4 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200"
        >
          <img
            src="/logo.jpeg"
            alt="Sands & Scents Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
        </motion.button>
      </motion.div>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo.jpeg"
                      alt="Logo"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Sands & Scents</h2>
                      <p className="text-sm text-gray-600">Support Center</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Support Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                      Contact Support
                    </h3>
                    
                    <div className="space-y-3">
                      <motion.a
                        href="tel:+919689938474"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-blue-600 mr-3" />
                        <span className="text-blue-800 font-medium">+91 9689938474</span>
                      </motion.a>
                      
                      <motion.a
                        href="tel:+919518774431"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Phone className="h-4 w-4 text-blue-600 mr-3" />
                        <span className="text-blue-800 font-medium">+91 9518774431</span>
                      </motion.a>
                    </div>
                  </div>

                  {/* WhatsApp Community */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                      WhatsApp Community
                    </h3>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="text-center mb-4">
                        <motion.div
                          animate={{ 
                            boxShadow: [
                              '0 0 20px rgba(16, 185, 129, 0.3)',
                              '0 0 40px rgba(16, 185, 129, 0.6)',
                              '0 0 20px rgba(16, 185, 129, 0.3)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block p-2 bg-white rounded-lg"
                        >
                          <img
                            src="/QR.png"
                            alt="WhatsApp QR Code"
                            className="w-40 h-40 object-cover rounded"
                          />
                        </motion.div>
                      </div>
                      
                      <p className="text-sm text-gray-600 text-center mb-3">
                        Scan this QR code using the WhatsApp camera to join our community
                      </p>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        onClick={() => window.open('https://chat.whatsapp.com/JbmJWWnLTpgL7ejtBoy4Qs', '_blank')}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join WhatsApp Community
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoSidePanel;
